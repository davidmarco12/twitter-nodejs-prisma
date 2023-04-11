import { PrismaClient } from '@prisma/client';

import { ReactionRepository } from '.';
import { ReactionDTO } from '../dto';


export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) { }

    async create(userId: string, postId: string, type: string): Promise<ReactionDTO> {
        const post = await this.db.reaction.create({
            data: {
                userId,
                postId,
                typeReaction: type
            },
        });
        return new ReactionDTO(post);
    }



    async delete(postId: string, type: string): Promise<void> {
        await this.db.reaction.deleteMany({
            where: {
                postId,
                AND: {
                    typeReaction: type,
                  },
            },
        });
    }

}


