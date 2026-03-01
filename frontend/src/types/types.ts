export interface Message {
  uuid: string;
  message: string;
  senderUuid: string;
  receiverUuid: string;
  senderUserName: string;
  senderEmail: string;
  createdAt: string;
}

export interface User {
  uuid: string;
  userName: string;
  email: string;
  isOnline: boolean;
  lastSeen?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageUuid?: string;
  image?: string;
}