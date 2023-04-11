import { OffsetPagination } from '@types';
import { FollowerDTO } from '../dto';

export interface FollowerService {
  createFollower(followerId: string, followedId: string): Promise<void>;
  deleteFollower(followerId: string, followedId: string): Promise<void>;
  getFollower(follower: any): Promise<FollowerDTO>;
  // getUserRecommendations(userId: any, options: OffsetPagination): Promise<FollowerDTO[]>;
}
