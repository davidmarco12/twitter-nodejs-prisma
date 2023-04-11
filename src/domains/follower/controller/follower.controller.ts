import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db } from '@utils';

import { FollowerRepositoryImpl } from '../repository';
import { FollowerService, FollowerServiceImpl } from '../service';

export const followerRouter = Router();

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db));



/**
 * @swagger
 *
 * /api/follower/follow/{userId}:
 *  post:
 *      summary: Follow a user.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Follower
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            description: user id
 *
 *      responses:
 *              '200':
 *                  description: list of users
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: object
 */
followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: otherUserId } = req.params;
  await service.createFollower(userId, otherUserId);

  return res.status(HttpStatus.OK).json({
    message: "User Followed"
  });
});

/**
 * @swagger
 *
 * /api/follower/unfollow/{userId}:
 *  delete:
 *      summary: Unfollow a user.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Follower
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            description: user id
 *
 *      responses:
 *              '200':
 *                  description: list of users
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: object
 */

followerRouter.delete('/unfollow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: otherUserId } = req.params;

  await service.deleteFollower(userId, otherUserId);

  return res.status(HttpStatus.OK).json({
    message: "Unfollow User"
  });
});