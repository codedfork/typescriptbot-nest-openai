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
import { OpenaiService } from '../openai/openai.service';
import { IOpenaiTextContent } from '../openai/openai.interface';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with frontend origin in production
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ChatGateway.name);
  private readonly messageQueue = [];
  constructor(private readonly openaiService: OpenaiService) {

  }

  @WebSocketServer()
  server: Server;

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
      //Generating gpt response
      const payload: IOpenaiTextContent = { textContent: message };
      

      const gptResponse = await this.openaiService.processGpt(payload);
      this.server.emit('message', `${gptResponse}`);
    } catch (error) {
      this.logger.error(error);
    }

  }
}
