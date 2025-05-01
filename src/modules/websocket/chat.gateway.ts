import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatQueueService } from '../bull-mq/chat-queue.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with frontend origin in production
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatQueueService: ChatQueueService) {

  }

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
  }
  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
    this.logger.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
    this.logger.log(`✅ Client disconnected: ${client.id}`);

  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.log(`✅ Message from client: ${message} ${client.id}`);

      this.server.emit('message', `Please wait....`);
      this.chatQueueService.addMessageJob(message, client.id);
    } catch (error) {
      this.logger.error(error);
    }

  }
}
