export class ReactionDTO {
    constructor(reaction: ReactionDTO) {
      this.id = reaction.id;
      this.postId  = reaction.postId;
      this.userId  = reaction.userId;
      this.typeReaction  = reaction.typeReaction;
      this.createdAt = reaction.createdAt;
    }
    
    id: string;
    postId: string;
    userId: string;
    typeReaction: string;
    createdAt: Date;

    //Post - Reaction 1:N
}