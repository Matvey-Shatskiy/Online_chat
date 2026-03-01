// components/Navbar.tsx (альтернативный вариант с аватаром)
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import ProfileModal from './ProfileModal';
import { getImageUrl } from '../services/utils';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    setProfileModalOpen(true);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  fontWeight: 'bold'
                }}
              >
                Главная
              </Typography>
              {isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  Панель управления
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {user?.email}
                  </Typography>
                  
                  {/* Меню с аватаром */}
                  <IconButton
                    onClick={handleSettingsClick}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }} src={getImageUrl(user?.image ? user?.image : '')}>
                      {/* {user?.email?.[0].toUpperCase()} */}
                    </Avatar>
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2">{user?.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ваш профиль
                        </Typography>
                      </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSettingsClick}>
                      Настройки
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Выйти
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    Войти
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <ProfileModal 
        open={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;