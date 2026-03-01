import React, { memo } from 'react';
import {
  Paper,
  List,
  Divider,
  Typography,
  ListItem,
  ListItemText,
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
    <Paper 
      variant="outlined" 
      sx={{ 
        height: 300,
        overflow: 'auto',
        backgroundColor: '#fafafa'
      }}
    >
      <List>
        {users.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary={
                <Typography color="text.secondary" align="center">
                  {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
                </Typography>
              }
            />
          </ListItem>
        ) : (
          users.map((user, index) => (
            <React.Fragment key={user.uuid}>
              <UserListItem 
                user={user} 
                onClick={onUserClick} 
                isActive={user.uuid === activeUserUuid} 
              />
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
});

UserList.displayName = 'UserList';

export default UserList;