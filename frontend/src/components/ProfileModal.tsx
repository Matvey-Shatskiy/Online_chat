import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { profileService, ProfileData } from '../services/profileService';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    email: user?.email || '',
    bio: '',
    birthdate: '',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(''); 

  useEffect(() => {
    if (open && user?.uuid) {
      loadProfile();
    }
  }, [open, user?.uuid]);

  const loadProfile = async () => {
    if (!user?.uuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(user.uuid);
      setProfileData({
        email: data.email || user.email || '',
        bio: data.bio || '',
        birthdate: data.birthdate || '',
        image: data.image || '',
      });
      setImagePreview(data.image || ''); 
    } catch (err) {
      setError('Не удалось загрузить данные профиля');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file); 
      const previewUrl = URL.createObjectURL(file);
      console.log('previewUrl', previewUrl)
      setImagePreview(previewUrl); 
    }
  };

  const handleClose = () => {
    if (imagePreview && !profileData.image) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(profileData.image || ''); 
    setImageFile(null); 
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSave = async () => {
    if (!user?.uuid) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = profileData.image;
      if (imageFile) {
        imageUrl = await profileService.uploadImage(user.uuid, imageFile);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, image: imageUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      await profileService.updateProfile(user.uuid, {
        bio: profileData.bio,
        birthdate: profileData.birthdate,
      });

      setSuccess(true);
      await loadProfile();

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError('Не удалось сохранить изменения');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Настройки профиля
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          Close
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success">
              Профиль успешно обновлен!
            </Alert>
          )}

          {/* Email (только для чтения) */}
          <TextField
            label="Email"
            value={profileData.email}
            disabled
            fullWidth
            variant="outlined"
          />

          {/* Изображение профиля */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={imagePreview ? `http://192.168.1.16:8000${imagePreview}` : ''}
                sx={{ width: 120, height: 120 }}
              >
                {!imagePreview && profileData.email?.[0]}
              </Avatar>
            
            <Button
              variant="outlined"
              component="label"
              disabled={saving}
            >
              Загрузить фото
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange} 
              />
            </Button>
            
            {imageFile && ( 
              <Typography variant="caption" color="text.secondary">
                Выбрано: {imageFile.name}
              </Typography>
            )}
          </Box>

          {/* Bio */}
          <TextField
            label="О себе"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            disabled={saving}
            placeholder="Расскажите о себе..."
          />

          {/* Дата рождения */}
          <TextField
            label="Дата рождения"
            type="date"
            value={profileData.birthdate}
            onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
            fullWidth
            variant="outlined"
            disabled={saving}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={saving}>
          Отмена
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;