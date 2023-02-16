import { NextFunction, Request, Response } from 'express';

export interface UserInterface {
  login: string;
  password: string;
  readonly id: string;
  profilePhoto: string | null;
  name: string;
  surname: string;
  location: string;
  socialMedia: SocialMediaLinksInterface;
  email: string;
  info: {
    hobbies: string;
    music: string;
    cinema: string;
    books: string;
  };
  friends: Array<string>;
  posts: Array<PostInterface>;
  photos: Array<string>;
  chat: Array<ChatInterface>;
}

interface SocialMediaLinksInterface {
  instagram: string;
  twitter: string;
  linkedIn: string;
}

export interface PostInterface {
  readonly id: string;
  user: {
    readonly id: string;
    name: string;
    surname: string;
  };
  date: string;
  text: string;
  likes: number;
  isLikedByUser: boolean;
}

export interface ChatInterface {
  readonly senderId: string;
  senderInfo: {
    name: string;
    surname: string;
    profilePhoto: string;
  };
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
  readonly text: string;
  readonly userIdTo: string;
}
