import { Server, Socket } from 'socket.io';
import { db } from '@utils';
import { MessageRepositoryImpl } from '@domains/message/repository';
import { MessageService, MessageServiceImpl } from '@domains/message/service';
import { PostRepositoryImpl } from '@domains/post/repository';
import { PostService, PostServiceImpl } from '@domains/post/service';

import jwt from 'jsonwebtoken';
import { Constants } from '@utils';

// Use dependency injection
const service: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db));
const servicePost: PostService = new PostServiceImpl(new PostRepositoryImpl(db));

export default (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // const token = socket.handshake.auth.token;

    // try {
    //   const decodedToken = jwt.verify(token, Constants.TOKEN_SECRET);
    //   console.log('user conected:', decodedToken);
    // } catch (error) {
    //   console.error('error:', error);
    //   socket.disconnect();
    //   return;
    // }

    const isPublicOrFollowed = async (senderId: string, receiverId: string): Promise<Boolean> =>
      await servicePost.canSeePosts(senderId, receiverId);

    //Send new messages
    socket.on('client:newmessage', async ({ senderId, receiverId, content }) => {
      if (await isPublicOrFollowed(senderId, receiverId)) {
        const newMessage = await service.create(senderId, receiverId, content);
        io.emit('server:newmessage', newMessage);
      } else {
        io.emit('server:newmessage', "Not permited this user is private");
        console.log('Not permited');
      }
    });

    //Get the messages by sender and receiver
    socket.on('client:getmessages', async ({ senderId, receiverId }) => {
      if (await isPublicOrFollowed(senderId, receiverId)) {
        const messages = await service.getMessagesBySender(senderId, receiverId);
        io.emit('server:getmessages', messages);
      } else {
        io.emit('server:getmessages', "Not permited this user is private");
        console.log('Not permited');
      }
    });

    //Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected id:', socket.id);
    });
  });
};
