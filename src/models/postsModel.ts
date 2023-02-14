import { Transform } from 'stream';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';
import { readFile, writeFile } from 'fs/promises';

import {
  JsonStreamDataInterface,
  PostInterface,
  UserInterface,
} from 'src/types';
import { readUsers } from 'src/utils';
import { usersPath } from 'src/constants';

export const getAllPosts = () => {
  const getPosts = (users: Array<UserInterface>) =>
    users.flatMap(({ posts }) => posts);

  const transform = new Transform({
    objectMode: true,
    transform(chunk: JsonStreamDataInterface, encoding: string, callback) {
      const posts = getPosts(chunk.value);

      callback(null, JSON.stringify(posts));
    },
  });

  return readUsers(usersPath)
    .pipe(parser())
    .pipe(streamValues())
    .pipe(transform);
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

  return readUsers(usersPath)
    .pipe(parser())
    .pipe(streamValues())
    .pipe(transform);
};

export const addPost = async (body: PostInterface) => {
  const { userId } = body;
  const users = await readFile(usersPath, { encoding: 'utf8' });

  const updatedUsers = (JSON.parse(users) as Array<UserInterface>).map((user) =>
    user.id === userId ? { ...user, posts: [...user.posts, body] } : user,
  );

  return writeFile(usersPath, JSON.stringify(updatedUsers));
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
