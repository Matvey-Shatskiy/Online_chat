import React, { memo } from 'react';
import {
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { Message } from '../types/types';
import { formatTime } from '../services/utils';

interface MessageItemProps {
  message: Message;
  isOwner: boolean;
}

const MessageItem: React.FC<MessageItemProps> = memo(({ message, isOwner }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: isOwner ? 'flex-end' : 'flex-start', 
      mb: 0.5 
    }}>
      <Box
        sx={{
          maxWidth: '80%',
          width: 'fit-content',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            backgroundColor: isOwner ? '#c9b6d27e' : '#bbdde983',
            width: 'fit-content',
            maxWidth: '100%',
            gap: 0.25,
            padding: '8px 12px',
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: isOwner ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap', 
          }}>
            <Typography 
              component="span" 
              variant="subtitle2" 
              color="#3c4f6f"
              fontWeight='700'
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              {message.senderUserName}
            </Typography>
            <Typography 
              component="span" 
              variant="caption" 
              color="#3c4f6f"
              fontWeight='100'
              fontSize='10px'
              sx={{
                whiteSpace: 'nowrap', 
              }}
            >
              {formatTime(message.createdAt)}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              wordBreak: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap', 
              maxWidth: '100%',
              textAlign: isOwner ? 'right' : 'left', 
            }}
          >
            {message.message}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;