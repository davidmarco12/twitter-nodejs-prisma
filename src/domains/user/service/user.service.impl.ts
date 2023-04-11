import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { UserDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';
import { PostDTO } from '@domains/post/dto';
import { ReactionDTO } from '@domains/reaction/dto';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) { }

  async getUser(userId: any): Promise<UserDTO> {
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException('user');
    return user;
  }

  getUserRecommendations(userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    return this.repository.getRecommendedUsersPaginated(options);
  }

  deleteUser(userId: any): Promise<void> {
    return this.repository.delete(userId);
  }

  changePrivacy(userId: string, isPublic: boolean): Promise<void> {
    return this.repository.changeProfilePrivacy(userId, isPublic);
  }

  getCommentsById(id: string): Promise<PostDTO[]> {
    return this.repository.getCommentsById(id);
  }

  getLikesById(id: string): Promise<ReactionDTO[]> {
    return this.repository.getLikesById(id);
  }

  getRetweetsById(id: string): Promise<ReactionDTO[]> {
    return this.repository.getRetweetsById(id);
  }
}
