import React, { memo } from 'react';
import {
  ListItem,
  ListItemText,
  Avatar,
  Badge,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { User } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { formatTime, getImageUrl } from '../services/utils';

interface UserListItemProps {
  user: User;
  onClick?: (user: User) => void;
  isActive?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = memo(({ user, onClick, isActive }) => {
  const currUser = useAuth();
  console.log('user', user)
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        '&:hover': {
          backgroundColor: '#1565c01d',
        },
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: isActive ? '#1565c03d' : 'white',
      }}
      onClick={() => onClick?.(user)}
    >
      <Badge
        color={user.isOnline ? "success" : "default"}
        badgeContent=""
        variant='dot'
        sx={{
          '& .MuiBadge-badge': {
            right: 5,
            top: 5,
            border: user.isOnline ? `2px solid white` : `none`,
            boxSizing: 'border-box'
          },
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main'}} src={getImageUrl(user?.image ? user?.image : '')}>
          {user.userName.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', ml: 2, flexDirection: 'column', width: '100%'  }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, width: '100%' }}>
          <Typography component="span" variant="subtitle1">
            {user.userName}
          </Typography>
          <Typography component="span" variant="caption">
            {formatTime(user.lastMessageTime)}
          </Typography>
        </Box>
        <Box>
          <Typography component="span" variant="subtitle2" color="#1976d2">
            {user.lastMessageUuid === currUser.user?.uuid ? 'You: ' : ''}
          </Typography>
          <Typography component="span" variant="subtitle2" color="text.secondary">
            {user.lastMessage}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
});

UserListItem.displayName = 'UserListItem';

export default UserListItem;