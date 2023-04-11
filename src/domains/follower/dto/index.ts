export class FollowerDTO {
  
  constructor(follower: FollowerDTO) {
    this.id = follower.id;
    this.followerId = follower.followerId;
    this.followedId = follower.followedId;
    this.createdAt = follower.createdAt;
  }

  id: string;
  followerId: string | null;
  followedId: string | null;
  createdAt: Date;
}

// export class ExtendedFollowerDTO extends FollowerDTO {

//   constructor(user: ExtendedFollowerDTO) {
//     super(user)
//     // this.email = user.email;
//     // this.name = user.name;
//     // this.password = user.password;
//   }

//   // email!: string;
//   // username!: string;
//   // password!: string;
// }
