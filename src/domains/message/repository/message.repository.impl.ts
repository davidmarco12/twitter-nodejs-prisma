import { PrismaClient } from '@prisma/client';

import { MessageRepository } from '.';
import { MessageDTO } from '../dto';


export class MessageRepositoryImpl implements MessageRepository {
    constructor(private readonly db: PrismaClient) { }

    async getAll(): Promise<MessageDTO[]> {
        return await this.db.message.findMany({
            orderBy: [
                {
                  id: 'asc',
                },
            ],
        });
    }
    
    async create(senderId: string, receiverId: string, content: string): Promise<MessageDTO> {
        const message = await this.db.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
        return new MessageDTO(message);
    }

    async getBySender(senderId: string, receiverId: string): Promise<MessageDTO[]> {
        const messages = await this.db.message.findMany({
            where: {
                AND: [
                  {
                    senderId
                  },
                  {
                    receiverId
                  }
                ]
              }
        });

        return messages;
    }

}


