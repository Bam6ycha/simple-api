import fs from 'fs';
import path from 'path';
import { Transform } from 'stream';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';
import { readFile, writeFile } from 'fs/promises';

import {
  JsonStreamDataInterface,
  PostInterface,
  UserInterface,
} from 'src/types';

const usersPath = path.resolve('src', 'db', 'users.json');

export const readUsers = () => {
  const readStream = fs.createReadStream(usersPath, {
    encoding: 'utf8',
  });

  return readStream.on('end', () => {
    readStream.destroy();
  });
};

export const getAllUsers = () => {
  return readUsers();
};

export const findUserById = (id: string) => {
  const findUserByIdTransform = (users: Array<UserInterface>) =>
    users.find(({ id: userId }) => userId === id);
  const transform = new Transform({
    objectMode: true,
    transform(chunk: JsonStreamDataInterface, encoding, callback) {
      const user = findUserByIdTransform(chunk.value);

      if (user) {
        callback(null, JSON.stringify(user));
      } else {
        callback(new Error('User not found'));
      }
    },
  });

  return readUsers().pipe(parser()).pipe(streamValues()).pipe(transform);
};

export const getAllPosts = () => {
  const getPosts = (users: Array<UserInterface>) =>
    users.flatMap(({ posts }) => posts);

  const transform = new Transform({
    objectMode: true,
    transform(chunk: JsonStreamDataInterface, encoding, callback) {
      const posts = getPosts(chunk.value);

      callback(null, JSON.stringify(posts));
    },
  });

  return readUsers().pipe(parser()).pipe(streamValues()).pipe(transform);
};

export const getPostById = (id: string) => {
  const findPostById = (users: Array<UserInterface>) =>
    users.flatMap(({ posts }) => posts).find(({ id: postId }) => postId === id);

  const transform = new Transform({
    objectMode: true,
    transform(chunk: JsonStreamDataInterface, encoding, callback) {
      const post = findPostById(chunk.value);

      if (post) {
        callback(null, JSON.stringify(post));
      } else {
        callback(new Error('Post not found'));
      }
    },
  });

  return readUsers().pipe(parser()).pipe(streamValues()).pipe(transform);
};

export const addPost = async (body: PostInterface) => {
  const { userId } = body;
  const users = await readFile(usersPath, { encoding: 'utf8' });

  const updatedUsers = (JSON.parse(users) as Array<UserInterface>).map((user) =>
    user.id === userId ? { ...user, posts: [...user.posts, body] } : user,
  );

  return writeFile(usersPath, JSON.stringify(updatedUsers));
};

export const addUser = async (body: UserInterface) => {
  const users = await readFile(usersPath, { encoding: 'utf8' });
  const updatedUsers = JSON.parse(users) as Array<UserInterface>;

  return writeFile(usersPath, JSON.stringify([...updatedUsers, body]));
};

export const deletePost = async (id: string) => {
  const users = await readFile(usersPath, { encoding: 'utf8' });
  const updatedUsers = JSON.parse(users) as Array<UserInterface>;

  return writeFile(
    usersPath,
    JSON.stringify([
      ...updatedUsers.flatMap((user) => ({
        ...user,
        posts: user.posts.filter(({ id: postId }) => id !== postId),
      })),
    ]),
  );
};

export const deleteUser = async (id: string) => {
  const users = await readFile(usersPath, { encoding: 'utf8' });
  const updatedUsers = JSON.parse(users) as Array<UserInterface>;

  return writeFile(
    usersPath,
    JSON.stringify([...updatedUsers.filter(({ id: userId }) => id !== userId)]),
  );
};
