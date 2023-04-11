import { ReactionDTO } from '../dto';
import { ReactionRepository } from '../repository';
import { ReactionService } from '.';

export class ReactionServiceImpl implements ReactionService {
  constructor(private readonly repository: ReactionRepository) {}

  async create(userId: string, postId: string, type: string): Promise<ReactionDTO> {
    return this.repository.create(userId, postId, type);
  }

  async delete(postId: string, type: string): Promise<void> {
    return this.repository.delete(postId, type);
  }

}
