export interface UserInterface {
  id: string;
  profilePhoto: '';
  name: string;
  surname: string;
  location: string;
  socialMedia: [instagram: string, twitter: string, linkedIn: string];
  email: string;
  info: {
    hobbies: string;
    music: string;
    cinema: string;
    books: string;
  };
  friends: Array<string>[];
  posts: Array<PostInterface>;
  photos: Array<string>[];
}

export interface PostInterface {
  id: string;
  userId: string;
  date: string | number;
  content: string;
  likes: number;
}

export interface JsonStreamDataInterface {
  key: string;
  value: Array<UserInterface>;
}
