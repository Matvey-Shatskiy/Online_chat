import React, { memo } from 'react';
import {
  InputBase,
  Box,
  IconButton,
} from '@mui/material';
import { ReactComponent as SearchIcon } from '../assets/search.svg';

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

const UserSearch: React.FC<UserSearchProps> = memo(({
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        component="form"
        sx={{
          p: '4px',
          pr: 2,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 0,
        }}
      >
        <Box>
          <IconButton>
            <SearchIcon style={{ width: 24, height: 24, margin: 8 }} />
          </IconButton>
        </Box>
        <Box className='search-input'>
          <InputBase
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Box>
      </Box>
    </Box>
  );
});

UserSearch.displayName = 'UserSearch';

export default UserSearch;