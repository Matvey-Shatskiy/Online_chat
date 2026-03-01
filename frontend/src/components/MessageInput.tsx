import React from 'react';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isConnected: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
  isConnected,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Введите сообщение..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={onSend}
                  disabled={disabled || !isConnected}
                  color="primary"
                >
                  {/* <SendIcon /> */}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={onSend}
          disabled={disabled || !isConnected}
          sx={{ minWidth: 100 }}
        >
          Отправить
        </Button>
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Нажмите Enter для отправки, Shift+Enter для новой строки
      </Typography>
    </>
  );
};

export default MessageInput;