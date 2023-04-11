import { SignupInputDTO } from '@domains/auth/dto';
import { PrismaClient } from '@prisma/client';
import { OffsetPagination } from '@types';
import {  FollowerDTO } from '../dto';
import { FollowerRepository } from './follower.repository';

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor(private readonly db: PrismaClient) { }

  async create(followerId: string, followedId: string): Promise<void> {
    await this.db.follow.create({
      data: {
        followerId,
        followedId
      }
    });
  }

  async getById(followerId: any): Promise<FollowerDTO | null> {
    const follower = await this.db.follow.findUnique({
      where: {
        id: followerId,
      },
    });
    return follower ? new FollowerDTO(follower) : null;
  }

  async delete(followerId: string, followedId: string): Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        AND: [
          {
            followedId
          },
          {
            followerId
          }
        ]
      }
    });
  }

  //   async getRecommendedUsersPaginated(options: OffsetPagination): Promise<UserDTO[]> {
  //     const users = await this.db.user.findMany({
  //       take: options.limit,
  //       skip: options.skip,
  //       orderBy: [
  //         {
  //           id: 'asc',
  //         },
  //       ],
  //     });
  //     return users.map(user => new UserDTO(user));
  //   }

  //   async getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null> {
  //     const user = await this.db.user.findFirst({
  //       where: {
  //         OR: [
  //           {
  //             email,
  //           },
  //           {
  //             username,
  //           },
  //         ],
  //       },
  //     });
  //     return user ? new ExtendedUserDTO(user) : null;
  //   }
}
