import { Message } from "../types/types";
const API_URL = 'http://192.168.1.16:8000/api';

export const chatService = {
  async getPrivateChatHistory(receiverUuid: string, senderUuid: string): Promise<Message[]> {
    try {
      const response = await fetch(
        `${API_URL}/history/${senderUuid}/${receiverUuid}`
      );
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },

  async getGeneralChatHistory(): Promise<Message[]> {
    try {
      const response = await fetch(`${API_URL}/chat/history`);
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching general chat history:', error);
      return [];
    }
  },

  async getUserChats(userId: string): Promise<Array<{partnerId: string, lastMessage: Message}>> {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/chats`);
      const data = await response.json();
      return data.chats || [];
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
  }
};