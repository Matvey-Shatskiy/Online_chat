import React, { memo } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  alpha,
} from '@mui/material';

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const UserSearch: React.FC<UserSearchProps> = memo(({
  searchQuery,
  onSearchChange,
  onSearch,
  isLoading,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: alpha('#fff', 0.15),
        }}
        elevation={0}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton 
          type="button" 
          sx={{ p: '10px' }} 
          onClick={onSearch}
          disabled={isLoading}
        >
        </IconButton>
      </Paper>
    </Box>
  );
});

UserSearch.displayName = 'UserSearch';

export default UserSearch;