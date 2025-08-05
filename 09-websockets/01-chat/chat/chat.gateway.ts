import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ChatService } from "./chat.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if(!token){
      return client.disconnect(true)
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      // Сообщаем всем КРОМЕ подключившегося
      client.broadcast.emit('message', {
        username: 'System',
        text: `${client.data.user.username} joined the chat.`
      });      
    } catch (error){
      return client.disconnect(true);
    }
  }

  

  @SubscribeMessage("chatMessage")
  async chatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { text: string },
  ) {

    this.server.emit('message', {
      username: client.data.user.username,
      text: body.text
    })
    this.chatService.create({
      username: client.data.user.username,
      text: body.text,
      date: new Date()
    })
  }
}
