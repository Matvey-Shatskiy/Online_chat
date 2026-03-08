import { Box, Divider, List, Paper, Typography } from '@mui/material';
import React, { useRef, useEffect, memo, useMemo } from 'react';
import MessageItem from './MessageItem';
import { Message, User } from '../types/types';
import { useAuth } from '../context/AuthContext';

interface MessageListProps {
  messages: Message[];
  activeUserUuid: string;
  currentChatPartner: User;
}

const MessageList: React.FC<MessageListProps> = memo(({ messages, activeUserUuid, currentChatPartner }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end'
      });
    }
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end'
      });
    }
  }, [messages]);

  const messagesContent = useMemo(() => {
    if (messages.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: 'white' }}>
          <Typography color="text.secondary">
            No messages
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {messages.map((message: Message, index: number) => (
          <React.Fragment key={message.uuid}>
            <MessageItem
              message={message}
              isOwner={message.senderUuid === activeUserUuid}
            />
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </List>
    );
  }, [messages, activeUserUuid]);

  return (
    <Paper
      ref={containerRef}
      variant="outlined"
      sx={{
        height: 800,
        overflow: 'auto',
        mb: 2,
        p: 2,
        backgroundColor: '#fafafa',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#3c4f6f',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#8aa2c4',
        },
      }}
    >
      {messagesContent}
    </Paper>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;