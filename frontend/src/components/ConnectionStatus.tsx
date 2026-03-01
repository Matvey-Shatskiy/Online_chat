import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              backgroundColor: isConnected ? 'success.main' : 'error.main' 
            }} 
          />
          <Typography variant="body2" color={isConnected ? 'success.main' : 'error.main'}>
            {isConnected ? 'Подключено' : 'Не подключено'}
          </Typography>
        </Box>
      </Box>
      
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Нет подключения к чату. Сообщения не будут отправляться.
        </Alert>
      )}
    </>
  );
};

export default ConnectionStatus;