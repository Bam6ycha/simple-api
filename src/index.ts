import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import * as UserController from './controllers/usersController';

const PORT = process.env.PORT ?? 5000;

const app = express();
app.use(cors(), bodyParser.json(), bodyParser.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('charset', 'utf8');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(
  (
    error: Record<string, string>,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    console.log('Path: ', req.path);
    console.error('Error: ', error);

    if (error.type == 'redirect') {
      res.redirect('/error');
    } else if (error.type === 'time-out') {
      res.status(408).send(error.message);
    } else {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
);

app.get('/newsfeed', UserController.getAllPosts);
app.get('/newsfeed/:id', UserController.getPostById);
app.get('/:id', UserController.findUserById);
app.get('/', UserController.getAll);

app.post('/newsfeed', UserController.addPost);
app.post('/user', UserController.addUser);

app.delete('/newsfeed/:id', UserController.deletePost);
app.delete('/:id', UserController.deleteUser);

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
