import { ReactionDTO } from '../dto';

export interface ReactionRepository {
    create(userId: string, postId: string, type: string): Promise<ReactionDTO>;
    delete(postId: string, type: string): Promise<void>;
}
