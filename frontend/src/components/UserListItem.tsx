import React, { memo } from 'react';
import {
  ListItem,
  Avatar,
  Badge,
  Box,
  Typography,
} from '@mui/material';
import { User } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { formatTime, getImageUrl } from '../services/utils';

interface UserListItemProps {
  user: User;
  onClick?: (user: User) => void;
  isActive?: boolean;
  styleSettings?: string;
}

const UserListItem: React.FC<UserListItemProps> = memo(({ user, onClick, isActive, styleSettings }) => {
  const currUser = useAuth();
  return (
    <Box sx={{
      width: '100%',
      p: 1,
      pt: '8px',
      pb: styleSettings === 'last-item'  ? '8px' : '0',
      backgroundColor: 'white',
      borderRadius:
        styleSettings === 'first-item' ? '12px 12px 0px 0px' :
          styleSettings === 'last-item' ? '0px 0px 12px 12px' : '0'
    }}>
      <ListItem
        alignItems="center"
        sx={{
          '&:hover': {
            backgroundColor: '#c9b6d27a',
          },
          cursor: onClick ? 'pointer' : 'default',
          backgroundColor: isActive ? '#c9b6d2d2' : 'white',
          borderRadius: '8px',
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
          <Avatar sx={{ bgcolor: '#3c4f6f' }} src={getImageUrl(user?.image ? user?.image : '')}>
            {user.userName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', ml: 2, flexDirection: 'column', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, width: '100%' }}>
            <Typography component="span" variant="subtitle1">
              {user.userName}
            </Typography>
            <Typography component="span" variant="caption">
              {formatTime(user.lastMessageTime)}
            </Typography>
          </Box>
          <Box>
            <Typography component="span" variant="subtitle2" color="#8aa2c4" sx={{ fontWeight: 'bold' }}>
              {user.lastMessageUuid === currUser.user?.uuid ? 'You: ' : ''}
            </Typography>
            <Typography component="span" variant="subtitle2" color="text.secondary">
              {user.lastMessage}
            </Typography>
          </Box>
        </Box>
      </ListItem>
    </Box>
  );
});

UserListItem.displayName = 'UserListItem';

export default UserListItem;