import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';
import { UserRepositoryImpl } from '@domains/user/repository';

import { AuthService, AuthServiceImpl } from '../service';
import { LoginInputDTO, SignupInputDTO } from '../dto';
import { generateProfileImageUploadURL } from '@utils/pre-signedurl';

export const authRouter = Router();

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db));

/**
 * @swagger
 * /api/auth/signup:
 *  post:
 *      summary: Create an account.
 *      tags:
 *          - Auth
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                              email:
 *                                  type: string
 *
 *      responses:
 *              '200':
 *                  description: response with a json token
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  user:
 *                                      type: object
 *                                      properties:
 *                                          username:
 *                                              type: string
 *                                          email:
 *                                              type: string
 *                                          preSignedURL:
 *                                              type: string
 *                                          token:
 *                                              type: string
 * 
 *
 */

authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const user = await service.signup(data);

  const imageURL = await generateProfileImageUploadURL(user.id, "png");

  return res.status(HttpStatus.CREATED).json(
    {
      ...user,
      preSignedURL : imageURL,
    }
  );
});

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Access to the API.
 *      tags:
 *          - Auth
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                              password:
 *                                  type: string
 *
 *      responses:
 *              '200':
 *                  description: response with a json token
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  token:
 *                                      type: string
 *
 */

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.login(data);

  return res.status(HttpStatus.OK).json(token);
});
