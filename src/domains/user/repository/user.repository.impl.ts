import { SignupInputDTO } from '@domains/auth/dto';
import { PrismaClient } from '@prisma/client';
import { OffsetPagination } from '@types';
import { ExtendedUserDTO, UserDTO } from '../dto';
import { UserRepository } from './user.repository';
import { PostDTO } from '@domains/post/dto';
import { ReactionDTO } from '@domains/reaction/dto';
import { generateProfileImageUploadURL } from '@utils/pre-signedurl';
import { Constants } from '@utils';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) { }

  async create(data: SignupInputDTO): Promise<UserDTO> {
    const newUser = await this.db.user.create({
      data,
    });
    const imageProfile = `${Constants.IMAGE_URL}/${newUser.id}.png`;
    //Updating the imageURL.
    await this.db.user.update({
      where: {
        id: newUser.id
      },
      data: {
        imageProfile,
      }
    });

    return new UserDTO(newUser);
  }

  async getById(userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user ? new UserDTO(user) : null;
  }

  async delete(userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async changeProfilePrivacy(userId: string, isPublic: boolean): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        isPublic: isPublic
      }
    })
  }

  async getRecommendedUsersPaginated(options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit,
      skip: options.skip,
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
    return users.map(user => new UserDTO(user));
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    return user ? new ExtendedUserDTO(user) : null;
  }


  async getCommentsById (id: string): Promise<PostDTO[]> {
    const comments = await this.db.post.findMany({
      where:{
        AND: [
          {
            authorId : id
          },{
            parentPost : {
              not: null
            }
          }
        ]
      }
    });

    return comments;
  }

  async getLikesById(id: string): Promise<ReactionDTO[]> {
    const likes = await this.db.reaction.findMany({
      where:{
        AND: [
          {userId: id}, {typeReaction: "like",}
        ]
        
      }
    });

    return likes;
  }

  async getRetweetsById(id: string): Promise<ReactionDTO[]> {
    const retweets = await this.db.reaction.findMany({
      where:{
        AND: [
          {userId: id}, {typeReaction: "retweet",}
        ]
        
      }
    });

    return retweets; 
  }


}
