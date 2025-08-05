import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('history')
    async getHistory() {
        return this.chatService.getHistory();
    }
}