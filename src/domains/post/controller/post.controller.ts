import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';

import { PostRepositoryImpl } from '../repository';
import { PostService, PostServiceImpl } from '../service';
import { CreateCommentInputDTO, CreatePostInputDTO } from '../dto';


export const postRouter = Router();

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db));

/**
 * @swagger
 *
 * /api/post/:
 *  get:
 *      summary: see all post.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Posts
 *      responses:
 *              '200':
 *                  description: list of posts
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                      authorId:
 *                                          type: string
 *                                      content:
 *                                          type: string
 *                                      parentPost:
 *                                          type: string
 * 
 */

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});


/**
 * @swagger
 *
 * /api/post/{postId}:
 *  get:
 *      summary: see post by id.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema: 
 *              type: string
 *      responses:
 *              '200':
 *                  description: post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                    id:
 *                                        type: string
 *                                    authorId:
 *                                        type: string
 *                                    content:
 *                                        type: string
 *                                    parentPost:
 *                                        type: string
 * 
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;
  
  const post = await service.getPost(userId, postId);
  
  
  if(!post) return res.status(HttpStatus.NOT_FOUND).json(post);

  return res.status(HttpStatus.OK).json(post);
});


/**
 * @swagger
 *
 * /api/post/by_user/{userId}:
 *  get:
 *      summary: see post by user id that is public or a followed.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema: 
 *              type: string
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *          - in: query
 *            name: before
 *            schema:
 *              type: string
 *          - in: query
 *            name: after
 *            schema:
 *              type: string
 *      responses:
 *              '200':
 *                  description: post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                      authorId:
 *                                          type: string
 *                                      content:
 *                                          type: string
 *                                      parentPost:
 *                                          type: string
 * 
 */

postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;
  const isAFollower = await service.canSeePosts(userId, authorId);
  if(!isAFollower) return res.status(HttpStatus.NOT_FOUND).json({message: "This account is private "});
  const posts = await service.getPostsByAuthor(userId, authorId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});


/**
 * @swagger
 *
 * /api/post/:
 *  post:
 *      summary: create a post.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Posts
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            content:
 *                                type: string
 *      responses:
 *              '200':
 *                  description: post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                    id:
 *                                        type: string
 *                                    authorId:
 *                                        type: string
 *                                    content:
 *                                        type: string
 *                                    parentPost:
 *                                        type: string
 * 
 */

postRouter.post('/', BodyValidation(CreatePostInputDTO) ,async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const data = req.body;

  const post = await service.createPost(userId, data);

  return res.status(HttpStatus.CREATED).json(post);
});


/**
 * @swagger
 *
 * /api/post/comment:
 *  post:
 *      summary: create a post or a comment using the parent Post.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Comment
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            content:
 *                                type: string
 *                            parentPost:
 *                                type: string
 *      responses:
 *              '200':
 *                  description: post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                    id:
 *                                        type: string
 *                                    authorId:
 *                                        type: string
 *                                    content:
 *                                        type: string
 *                                    parentPost:
 *                                        type: string
 * 
 */
postRouter.post('/comment', BodyValidation(CreateCommentInputDTO) ,async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const data = req.body;

  const post = await service.createPost(userId, data);

  return res.status(HttpStatus.CREATED).json(post);
});


/**
 * @swagger
 *
 * /api/post/{postId}:
 *  delete:
 *      summary: delete a post by id.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema: 
 *              type: string
 *      responses:
 *              '200':
 *                  description: delete a post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                    message:
 *                                        type: string
 * 
 */

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  await service.deletePost(userId, postId);

  return res.status(HttpStatus.OK).json({message: "Deleted"});
});
