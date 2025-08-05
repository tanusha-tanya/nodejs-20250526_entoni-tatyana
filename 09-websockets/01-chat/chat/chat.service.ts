import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}


  async create(body: Partial<Message>) {
    await this.messageRepository.save(body);
    return body;
  }

  async getHistory() {
    const messages = await this.messageRepository.find({ order: { id: 'ASC' } });
    return messages.map(m => ({
      id: m.id,
      username: m.username,
      text: m.text,
      date: m.date,
    }));
  }
}
