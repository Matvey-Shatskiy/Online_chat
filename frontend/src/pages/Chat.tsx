import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Message, User } from '../types/types';
import useWebSocket from '../hooks/useWebSocket';
import UserList from '../components/UserList';
import UserSearch from '../components/UserSearch';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ConnectionStatus from '../components/ConnectionStatus';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { formatTime } from '../services/utils';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const chatIdRef = useRef<string | undefined>(chatId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentChatPartner, setCurrentChatPartner] = useState<User | null>(null);
  const memoizedFilteredUsers = useMemo(() => filteredUsers, [filteredUsers]);
  
  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);
  
  useEffect(() => {
    setMessages([]);
    setCurrentChatPartner(null);
  }, [chatId]);
  
  useEffect(() => {
    if (!user || !chatId) return;

    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const history = await chatService.getPrivateChatHistory(chatId, user.uuid);
        setMessages(history);
        
        const partner = users.find(u => u.uuid === chatId);
        setCurrentChatPartner(partner || null);
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [chatId, user, users]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {  
        navigate('/chat');
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  const handleMessage = useCallback((message: Message) => {    
    const currentChatId = chatIdRef.current;
    
    if (currentChatId && (message.senderUuid === currentChatId || message.receiverUuid === currentChatId)) {
      setMessages(prev => [...prev, message]);
    }
    
    const updatedUserInfo = {
      lastMessage: message.message,
      lastMessageTime: message.createdAt,
      lastMessageUuid: message.senderUuid,
    };
    
    setFilteredUsers(prev => prev.map(u => 
      u.uuid === message.senderUuid || u.uuid === message.receiverUuid ? { ...u, ...updatedUserInfo } : u
    ));
  }, []);

  const handleUsersUpdate = useCallback((usersList: User[]) => {
    setUsers(usersList);
    setFilteredUsers(usersList);
    
    const currentChatId = chatIdRef.current;
    if (currentChatId) {
      const partner = usersList.find(u => u.uuid === currentChatId);
      setCurrentChatPartner(partner || null);
    }
  }, []);

  const handleUserStatusUpdate = useCallback((uuid: string, isOnline: boolean) => {
    setUsers(prev => prev.map(u => 
      u.uuid === uuid ? { ...u, isOnline } : u
    ));
    setFilteredUsers(prev => prev.map(u => 
      u.uuid === uuid ? { ...u, isOnline } : u
    ));
    
    if (currentChatPartner?.uuid === uuid) {
      setCurrentChatPartner(prev => prev ? { ...prev, isOnline } : null);
    }
  }, [currentChatPartner]);

  const { isConnected, sendMessage } = useWebSocket({
    userUuid: user?.uuid || '',
    onMessage: handleMessage,
    onUsersUpdate: handleUsersUpdate,
    onUserStatusUpdate: handleUserStatusUpdate,
  });

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`http://192.168.1.16:8000/api/search?query=${query}`);
      const data = await response.json();
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected || !user || !chatId) {
      return;
    }

    const messageData = {
      type: 'private_message',
      message: newMessage.trim(),
      receiverUuid: chatId, 
      senderUuid: user.uuid,
      senderUserName: user.userName,
      senderEmail: user.email,
    };

    sendMessage(messageData);
    setNewMessage('');
  };

  const handleUserClick = (selectedUser: User) => {
    navigate(`/chat/${selectedUser.uuid}`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1, width: '30%', height: '80%' }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Пользователи
              </Typography>
              
              <UserSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={() => searchUsers(searchQuery)}
                isLoading={isLoadingUsers}
              />

              <UserList
                users={memoizedFilteredUsers}
                searchQuery={searchQuery}
                onUserClick={handleUserClick}
                activeUserUuid={chatId}
              />
            </CardContent>
          </Card>
        </Box>

        <Grid sx={{ flex: 2 }}>
          <Card elevation={3}>
            <CardContent>
              <ConnectionStatus isConnected={isConnected} />
              
              {isLoadingHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : chatId && currentChatPartner ? (
                <>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">
                      Чат с {currentChatPartner.userName}
                    </Typography>
                    {currentChatPartner.isOnline ? ( 
                      <Chip 
                        label="Онлайн" 
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ) : (
                      <Chip 
                        label={'Был в сети ' + formatTime(currentChatPartner.lastSeen)} 
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <MessageList 
                    messages={messages} 
                    activeUserUuid={user?.uuid || ''}  
                    currentChatPartner={currentChatPartner}
                  />
                  
                  <MessageInput
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                    isConnected={isConnected}
                  />
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Typography variant="h6">
                    Выберите пользователя для начала чата
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Container>
  );
};

export default Chat;