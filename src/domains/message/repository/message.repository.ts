import { MessageDTO } from '../dto';

export interface MessageRepository {
    create(senderId: string, receiverId: string, content: string): Promise<MessageDTO>;
    getBySender(senderId: string, receiverId: string): Promise<MessageDTO[]>
    getAll() : Promise<MessageDTO[]>;
}
