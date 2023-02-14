import { HandlerFunction, PostInterface } from 'src/types';
import { v4 } from 'uuid';
import * as PostsModel from '../models/postsModel';

export const addPost: HandlerFunction = async (req, res, next) => {
  try {
    const { body } = req;

    const bodyWithId: PostInterface = { ...body, id: v4() };

    await PostsModel.addPost(bodyWithId);

    res.status(200).send(bodyWithId);
  } catch (error) {
    res.status(400).send('Bad request');
    next(error);
  }
};

export const deletePost: HandlerFunction = async (req, res, next) => {
  try {
    const { id } = req.params;

    await PostsModel.deletePost(id);

    res.status(204).send({});
  } catch (error) {
    res.status(400).send('bad request');
  }
};

export const getPostById: HandlerFunction = (req, res, next) => {
  const { id } = req.params;

  PostsModel.getPostById(id)
    .on('error', (error) => {
      res.status(400).send('Posts not found');
      next(error);
    })
    .pipe(res)
    .on('finish', () => {
      res.status(200);
    });
};

export const getAllPosts: HandlerFunction = (req, res, next) => {
  PostsModel.getAllPosts()
    .on('error', (error) => {
      res.status(400).send('Posts not found');
      next(error);
    })
    .pipe(res)
    .on('finish', () => {
      res.status(200);
    });
};
