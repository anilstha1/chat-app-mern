export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  users: User[];
  latestMessage: Message;
  isGroupChat: boolean;
  groupAdmin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
  updatedAt: string;
}
