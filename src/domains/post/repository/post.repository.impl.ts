import { PrismaClient } from '@prisma/client';

import { CursorPagination } from '@types';

import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data,
      },
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated(userId: string, options: CursorPagination): Promise<PostDTO[]> {

    const posts = await this.db.post.findMany({
      where: {
        author: {
          OR: [
            { isPublic: true },
            { followers: { some: { followerId: userId } } }
          ]
        }
      },
      ...(options.after || options.before) && {
        cursor: {
          id: options.after ? options.after : options.before
        }
      }
      ,
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
    });

    return posts.map((post) => new PostDTO(post));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getById(postId: string, userId: string): Promise<PostDTO | null | any> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      //include: { author: true },
    });

    const comments = await this.db.post.findMany({
      where: {
        parentPost : post?.id
      },
      include: { reaction: true }
    });
    
    
    const newComment = comments.map( comment => {
      const quantity = comment.reaction.length;
      return {
        ...comment,
        reaction: quantity
      }
    }).sort( (a,b) => b.reaction - a.reaction);
    
    const canSee = await this.canSeePosts(userId, post?.authorId as string);

    if(!canSee){
      return null
    }

    // const commentsQuery : [] = await this.db.$queryRaw`
    //   SELECT 
    //     "p"."id", 
    //     "p"."content", 
    //     COALESCE("parent"."content", '') AS "parent_content", 
    //     SUM(CASE WHEN "r"."typeReaction" = 'like' THEN 1 ELSE 0 END) + 
    //     SUM(CASE WHEN "r"."typeReaction" = 'retweet' THEN 1 ELSE 0 END) AS "reaction_count"      
    //   FROM 
    //     "Post" p 
    //     LEFT JOIN "Post" parent ON "parent"."id" = "p"."parentPost" 
    //     LEFT JOIN "Reaction" r ON "r"."postId" = "p"."id"
    //   WHERE 
    //     "p"."parentPost" = CAST(${postId} AS uuid) 
    //     AND "p"."deletedAt" IS NULL 
    //   GROUP BY 
    //     "p"."id", 
    //     "parent_content" 
    //   ORDER BY 
    //     "reaction_count" DESC 
    //   LIMIT 10
    // `;


    // const comments = commentsQuery.map((comment : any) => ({
    //   ...comment,
    //   reaction_count: Number(comment.reaction_count),
    // }));

    return post ? {
      ...post,
      comments : newComment.slice(0,9)
    } : null;
  }

  async getByAuthorId(userId:string, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId,
      },
      ...(options.after || options.before) && {
        cursor: {
          id: options.after ? options.after : options.before
        }
      }
      ,
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
    })
    return posts.map((post) => new PostDTO(post));
  }

  async canSeePosts(followerId: string, followedId: string): Promise<Boolean> {
    if(followerId === followedId) return true

    const followedUser = await this.db.user.findUnique({
      where:{
        id: followedId
      }
    });
    console.log({followedUser})
    if(followedUser?.isPublic === false){
      const isFollower = await this.db.follow.findMany({
        where : {
          followedId,
          AND: {
            followerId
          }
        }
      });
      
      if(isFollower.length < 1) return false;
    }

    return true
  }
}
