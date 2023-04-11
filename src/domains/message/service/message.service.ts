import {  MessageDTO } from '../dto';

export interface MessageService {
  create(senderId: string, receiverId: string, content: string): Promise<MessageDTO>;
  getMessagesBySender(senderId: string, receiverId: string): Promise<MessageDTO[]>;
  getAll(): Promise<MessageDTO[]>;
}