import { NextFunction, Request, Response } from 'express';

export interface UserInterface {
  id: string;
  profilePhoto: '';
  name: string;
  surname: string;
  location: string;
  socialMedia: { instagram: string; twitter: string; linkedIn: string };
  email: string;
  chat: Array<ChatInterface>;
  info: {
    hobbies: string;
    music: string;
    cinema: string;
    books: string;
  };
  friends: Array<string>;
  posts: Array<PostInterface>;
  photos: Array<string>;
  login: string;
  password: string;
}

export interface PostInterface {
  id: string;
  userId: string;
  date: string | number;
  content: string;
  likes: number;
  isLikedByUser: boolean;
}

export interface ChatInterface {
  senderId: string;
  history: Array<ChatHistoryInterface>;
}

interface ChatHistoryInterface {
  text: string;
  time: string;
  isOwnMessage: boolean;
}

export interface JsonStreamDataInterface {
  key: string;
  value: Array<UserInterface>;
}

export type HandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export interface UserMessageInterface {
  text: string;
  userIdTo: string;
}
