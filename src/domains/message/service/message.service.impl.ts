import { MessageDTO } from '../dto';
import { MessageRepository } from '../repository';
import { MessageService } from '.';

export class MessageServiceImpl implements MessageService {
  constructor(private readonly repository: MessageRepository) {}

  async create(senderId: string, receiverId: string, content: string): Promise<MessageDTO> {
    return this.repository.create(senderId, receiverId, content);
  }

  async getMessagesBySender(senderId: string, receiverId: string): Promise<MessageDTO[]> {
    return this.repository.getBySender(senderId, receiverId);
  }

  async getAll(): Promise<MessageDTO[]> {
    return this.repository.getAll();
  }

}
