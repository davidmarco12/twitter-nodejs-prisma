import { SignupInputDTO } from '@domains/auth/dto';
import { OffsetPagination } from '@types';
import {  FollowerDTO } from '../dto';

export interface FollowerRepository {
  create(followerId: string, followedId: string): Promise<void>;
  delete(followerId: string, followedId: string): Promise<void>;
  // getRecommendedUsersPaginated(options: OffsetPagination): Promise<FollowerDTO[]>;
  getById(followerId: string): Promise<FollowerDTO | null>;
  // getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedFollowerDTO | null>;
}
