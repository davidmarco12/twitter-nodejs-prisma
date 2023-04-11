import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { FollowerDTO } from '../dto';
import { FollowerRepository } from '../repository';
import { FollowerService } from './follower.service';

export class FollowerServiceImpl implements FollowerService {
  constructor(private readonly repository: FollowerRepository) { }

  async deleteFollower(followerId: string, followedId: string): Promise<void> {
    return this.repository.delete(followerId, followedId);
  }

  async createFollower(followerId: string, followedId: string): Promise<void> {
    return this.repository.create(followerId, followedId);
  }

  async getFollower(followerId: any): Promise<FollowerDTO> {
    const follower = await this.repository.getById(followerId);
    if (!follower) throw new NotFoundException('follower');
    return follower;
  }

  // async getFollower(userId: any): Promise<FollowerDTO> {
  //   const user = await this.repository.getById(userId);
  //   if (!user) throw new NotFoundException('user');
  //   return user;
  // }

  // getUserRecommendations(userId: any, options: OffsetPagination): Promise<FollowerDTO[]> {
  //   // TODO: make this return only users followed by users the original user follows
  //   return this.repository.getRecommendedUsersPaginated(options);
  // }

  // deleteUser(userId: any): Promise<void> {
  //   return this.repository.delete(userId);
  // }
}
