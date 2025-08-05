import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from "./entities/message.entity";
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
