import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';
import {
  Button,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import ProfileModal from './ProfileModal';
import { getImageUrl } from '../services/utils';
import { ReactComponent as SettingsIcon } from '../assets/settings.svg';
import { ReactComponent as LogoutIcon } from '../assets/logout.svg';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleSettingsClick = () => {
    setProfileModalOpen(true);
  };

  return (
    <>
      <Box position="static">

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleSettingsClick}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }} src={getImageUrl(user?.image ? user?.image : '')} />
              </IconButton>

              <Box>
                <IconButton onClick={handleSettingsClick}>
                  <SettingsIcon style={{ width: 24, height: 24 }} />
                </IconButton>
                <IconButton onClick={handleLogout}>
                  <LogoutIcon style={{ width: 24, height: 24 }} />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Log in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Box>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default Navbar;