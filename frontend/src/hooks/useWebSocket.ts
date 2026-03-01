import { useState, useEffect, useCallback } from 'react';
import { User, Message } from '../types/types';

interface UseWebSocketProps {
  userUuid: string;
  onMessage?: (message: Message) => void;
  onUsersUpdate?: (users: User[]) => void;
  onUserStatusUpdate?: (uuid: string, isOnline: boolean) => void;
}

const useWebSocket = ({
  userUuid,
  onMessage,
  onUsersUpdate,
  onUserStatusUpdate,
}: UseWebSocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((messageData: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(messageData));
    }
  }, [socket, isConnected]);

  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.1.16:8000/ws?user_uuid=${userUuid}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'message':
            onMessage?.({
              uuid: data.uuid || Date.now().toString(),
              message: data.message,
              senderUuid: data.senderUuid,
              receiverUuid: data.receiverUuid,
              senderUserName: data.senderUserName,
              senderEmail: data.senderEmail,
              createdAt: data.createdAt || new Date().toISOString(),
            });
            break;
          case 'users':
            onUsersUpdate?.(data.users || []);
            break;
          case 'user_status':
            onUserStatusUpdate?.(data.uuid, data.isOnline);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userUuid]);

  return { socket, isConnected, sendMessage };
};

export default useWebSocket;