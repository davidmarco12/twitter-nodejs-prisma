import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db } from '@utils';

import { UserRepositoryImpl } from '../repository';
import { UserService, UserServiceImpl } from '../service';

export const userRouter = Router();

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db));

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, skip } = req.query as Record<string, string>;

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
});

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  const user = await service.getUser(userId);

  return res.status(HttpStatus.OK).json(user);
});

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getUser(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});



/**
 * @swagger
 *
 * /api/user/comments/{userId}:
 *  get:
 *      summary: see comments by user id.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Comment
 *      parameters:
 *          - in: path
 *            name: userId
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

userRouter.get('/comments/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getCommentsById(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});


/**
 * @swagger
 *
 * /api/user/likes/{userId}:
 *  get:
 *      summary: see likes by user id.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Reaction
 *      parameters:
 *          - in: path
 *            name: userId
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
 *                                      postId:
 *                                          type: string
 *                                      userId:
 *                                          type: string
 *                                      typeReaction:
 *                                          type: string
 * 
 */

userRouter.get('/likes/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getLikesById(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});


/**
 * @swagger
 *
 * /api/user/retweets/{userId}:
 *  get:
 *      summary: see retweets by user id.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Reaction
 *      parameters:
 *          - in: path
 *            name: userId
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
 *                                      postId:
 *                                          type: string
 *                                      userId:
 *                                          type: string
 *                                      typeReaction:
 *                                          type: string
 * 
 */

userRouter.get('/retweets/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getRetweetsById(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});



/**
 * @swagger
 *
 * /api/user/changePrivacy:
 *  put:
 *      summary: change privacy to my user.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - User
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            isPublic:
 *                                type: boolean
 *      responses:
 *              '200':
 *                  description: post by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                    message:
 *                                        type: string
 * 
 */
userRouter.put('/changePrivacy', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { isPublic } = req.body;

  await service.changePrivacy(userId, isPublic);

  return res.status(HttpStatus.OK).json({
    message: `Your user Privacy was change to ${isPublic ? "public" : "private"}`
  });

});

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.deleteUser(userId);

  return res.status(HttpStatus.OK);
});
