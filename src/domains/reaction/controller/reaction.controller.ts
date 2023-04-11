import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db } from '@utils';

import { ReactionRepositoryImpl } from '../repository';
import { ReactionService, ReactionServiceImpl } from '../service';


export const reactionRouter = Router();

// Use dependency injection
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db));



/**
 * @swagger
 *
 * /api/reaction/{postId}:
 *  post:
 *      summary: make a reaction to a post.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Reaction
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema: 
 *              type: string
 *          - in: query
 *            name: type
 *            schema:
 *              type: string
 *      responses:
 *              '200':
 *                  description: reaction
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                  postId:
 *                                      type: string
 *                                  userId:
 *                                      type: string
 *                                  typeReaction:
 *                                      type: string
 * 
 */


reactionRouter.post('/:postId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;
    const { type } = req.query;

    const reaction = await service.create(userId, postId, type as string);

    return res.status(HttpStatus.OK).json(reaction);
});


/**
 * @swagger
 *
 * /api/reaction/{postId}:
 *  delete:
 *      summary: delete a reaction.
 *      security:
 *       - bearerAuth: []
 *      tags:
 *          - Reaction
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema: 
 *              type: string
 *          - in: query
 *            name: type
 *            schema:
 *              type: string
 *      responses:
 *              '200':
 *                  description: list of posts
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 * 
 */

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
    const { postId } = req.params;
    const {type} = req.query;

    await service.delete(postId, type as string);

    return res.status(HttpStatus.OK).json({
        message: `${type} deleted`
    });
});
