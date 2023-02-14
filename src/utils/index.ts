import fs from 'fs';

export const readUsers = (usersPath: string) => {
  const readStream = fs.createReadStream(usersPath, {
    encoding: 'utf8',
  });

  return readStream.on('end', () => {
    readStream.destroy();
  });
};
