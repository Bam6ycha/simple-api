import { NextFunction, Request, Response } from 'express';
import * as UsersModel from '../models/usersModel';
import { v4 } from 'uuid';
import { PostInterface, UserInterface } from 'src/types';

type HandlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export const getAll: HandlerFunction = (req, res, next) => {
  try {
    UsersModel.getAllUsers()
      .pipe(res)
      .on('finish', () => {
        res.status(200);
      });
  } catch (error) {
    next(error);
  }
};

export const findUserById: HandlerFunction = (req, res, next) => {
  const { id } = req.params;

  UsersModel.findUserById(id)
    .on('error', (error) => {
      res.status(404).send(error.message);
      next(error);
    })
    .pipe(res)
    .on('finish', () => {
      res.status(200);
    });
};

export const getAllPosts: HandlerFunction = (req, res, next) => {
  UsersModel.getAllPosts()
    .on('error', (error) => {
      res.status(400).send('Posts not found');
      next(error);
    })
    .pipe(res)
    .on('finish', () => {
      res.status(200);
    });
};

export const getPostById: HandlerFunction = (req, res, next) => {
  const { id } = req.params;

  UsersModel.getPostById(id)
    .on('error', (error) => {
      res.status(400).send('Posts not found');
      next(error);
    })
    .pipe(res)
    .on('finish', () => {
      res.status(200);
    });
};

export const addPost: HandlerFunction = async (req, res, next) => {
  try {
    const { body } = req;

    const bodyWithId: PostInterface = { ...body, id: v4() };

    await UsersModel.addPost(bodyWithId);

    res.status(200).send(bodyWithId);
  } catch (error) {
    res.status(400).send('Bad request');
    next(error);
  }
};

export const addUser: HandlerFunction = async (req, res, next) => {
  try {
    const { body } = req;

    const userWithId: UserInterface = { ...body, id: v4() };

    await UsersModel.addUser(userWithId);

    res.status(201).send(userWithId);
  } catch (error) {
    res.status(500).send('Cannot add user');
    next(error);
  }
};

export const deletePost: HandlerFunction = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UsersModel.deletePost(id);

    res.status(204).send({});
  } catch (error) {
    res.status(400).send('bad request');
  }
};

export const deleteUser: HandlerFunction = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UsersModel.deleteUser(id);

    res.status(204).send({});
  } catch (error) {
    res.status(400).send('bad request');
  }
};
