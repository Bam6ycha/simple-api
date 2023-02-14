import path from 'path';
import { Transform } from 'stream';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';
import { readFile, writeFile } from 'fs/promises';

import { JsonStreamDataInterface, UserInterface } from 'src/types';
import { readUsers } from 'src/utils';
import { usersPath } from 'src/constants';

export const getAllUsers = () => {
  return readUsers(usersPath);
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

  return readUsers(usersPath)
    .pipe(parser())
    .pipe(streamValues())
    .pipe(transform);
};

export const addUser = async (body: UserInterface) => {
  const users = await readFile(usersPath, { encoding: 'utf8' });
  const updatedUsers = JSON.parse(users) as Array<UserInterface>;

  return writeFile(usersPath, JSON.stringify([...updatedUsers, body]));
};

export const deleteUser = async (id: string) => {
  const users = await readFile(usersPath, { encoding: 'utf8' });
  const updatedUsers = JSON.parse(users) as Array<UserInterface>;

  return writeFile(
    usersPath,
    JSON.stringify([...updatedUsers.filter(({ id: userId }) => id !== userId)]),
  );
};
