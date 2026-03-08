import React, { memo } from 'react';
import {
  List,
  Typography,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { User } from '../types/types';
import UserListItem from './UserListItem';

interface UserListProps {
  users: User[];
  searchQuery: string;
  onUserClick?: (user: User) => void;
  activeUserUuid?: string;
}

const UserList: React.FC<UserListProps> = memo(({ 
  users, 
  searchQuery, 
  onUserClick, 
  activeUserUuid 
}) => {
  return (
    <Box 
      sx={{ 
        p: 2,
        height: 800,
        overflow: 'auto',
        backgroundColor: '#f4f5f9', 
        borderRadius: '12px',
        pt: 0
      }}
    >
      <List sx={{ p: 0 }}>
        {users.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary={
                <Typography color="text.secondary" align="center">
                  {searchQuery ? 'Users not found' : 'No users'}
                </Typography>
              }
            />
          </ListItem>
        ) : (
          users.map((user, index) => (
            <Box key={user.uuid}>
              <UserListItem 
                user={user} 
                onClick={onUserClick} 
                isActive={user.uuid === activeUserUuid} 
                styleSettings = {index === users.length - 1 ? 'last-item' : index === 0 ? 'first-item' : ''}
              />
            </Box>
          ))
        )}
      </List>
    </Box>
  );
});

UserList.displayName = 'UserList';

export default UserList;