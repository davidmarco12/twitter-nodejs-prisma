import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';

import { MessageRepositoryImpl } from '../repository';
import { MessageService, MessageServiceImpl } from '../service';


export const messageRouter = Router();

// Use dependency injection
const service: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db));

// api/reaction/asdjhn12387123hbasdhb?type=like
messageRouter.get('/', async (req: Request, res: Response) => {
    const messages = await service.getAll();
    return res.status(HttpStatus.OK).json({
        messages,
    });
});

messageRouter.get('/:receiverId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { receiverId } = req.params;

    const messages = await service.getMessagesBySender(userId, receiverId);
    // const messsage = await service.allMessages();
    return res.status(HttpStatus.OK).json({
        messages,
    });
});