import { SignupInputDTO } from '@domains/auth/dto';
import { OffsetPagination } from '@types';
import { ExtendedUserDTO, UserDTO } from '../dto';
import { PostDTO } from '@domains/post/dto';
import { ReactionDTO } from '@domains/reaction/dto';

export interface UserRepository {
  create(data: SignupInputDTO): Promise<UserDTO>;
  delete(userId: string): Promise<void>;
  changeProfilePrivacy(userId: string, isPublic: boolean): Promise<void>;
  getRecommendedUsersPaginated(options: OffsetPagination): Promise<UserDTO[]>;
  getById(userId: string): Promise<UserDTO | null>;
  getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null>;
  getCommentsById(id: string): Promise<PostDTO[]>;
  getLikesById(id: string): Promise<ReactionDTO[]>;
  getRetweetsById(id: string):  Promise<ReactionDTO[]>;
}
