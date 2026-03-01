import React, { memo } from 'react';
import {
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { Message } from '../types/types';
import { formatTime, getImageUrl } from '../services/utils';
import { useAuth } from '../context/AuthContext';

interface MessageItemProps {
  message: Message;
  isOwner: boolean;
  currentChatPartnerImage: string;
}

const MessageItem: React.FC<MessageItemProps> = memo(({ message, isOwner, currentChatPartnerImage }) => {
  const user = useAuth();
  const userImage = getImageUrl(user.user?.image || '');
  const partnerImage = getImageUrl(currentChatPartnerImage);
  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: isOwner ? 'flex-end' : 'flex-start',
        alignItems: isOwner ? 'flex-end' : 'flex-start',
      }}
    >
      {!isOwner && (
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }} src={partnerImage}>
          {message.senderUserName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <ListItemText
        primary={
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isOwner ? 'flex-end' : 'flex-start', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <Typography component="span" variant="subtitle2" color="primary">
              {message.senderUserName}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary">
              {formatTime(message.createdAt)}
            </Typography>
          </Box>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="text.primary"
            sx={{ 
              wordBreak: 'break-word', 
              display: 'flex', 
              justifyContent: isOwner ? 'flex-end' : 'flex-start', 
              alignItems: 'center' 
            }}
          >
            {message.message}
          </Typography>
        }
      />
      {isOwner && (
        <Avatar sx={{ ml: 2, bgcolor: 'primary.main' }} src={userImage}>
          {message.senderUserName.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </ListItem>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;