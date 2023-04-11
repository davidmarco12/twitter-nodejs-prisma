import { OffsetPagination } from '@types';
import { UserDTO } from '../dto';
import { PostDTO } from '@domains/post/dto';
import { ReactionDTO } from '@domains/reaction/dto';

export interface UserService {
  deleteUser(userId: any): Promise<void>;
  getUser(userId: any): Promise<UserDTO>;
  getUserRecommendations(userId: any, options: OffsetPagination): Promise<UserDTO[]>;
  changePrivacy(userId: string, isPublic: boolean): Promise<void>;
  getCommentsById(id: string): Promise<PostDTO[]>;
  getLikesById(id: string): Promise<ReactionDTO[]>;
  getRetweetsById(id: string):  Promise<ReactionDTO[]>;

}
