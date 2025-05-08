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
import { OpenaiService } from '../openai/openai.service';
import { IOpenaiTextContent } from '../openai/openai.interface';
import { convertResponseToArray } from 'src/common/helpers';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with frontend origin in production
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatQueueService: ChatQueueService, private readonly openaiService: OpenaiService) { }
  private clients = new Set();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.server = server;
  }
  handleConnection(client: Socket) {
    this.logger.log(`✅ Client connected: ${client.id}`);
    this.logger.log(`Connected clients: ${this.clients}`);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.logger.log(`✅ Client disconnected: ${client.id}`);

  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {

      this.logger.log(`✅ Message from client: ${message} ${client.id}`);

      let payload: IOpenaiTextContent;
      let gptResponse: any;
      if (this.clients.has(client.id)) {
        console.log("Client exists in the set.");
        payload = { textContent: message };
        gptResponse = await this.openaiService.processGptChat(payload);
        this.server.to(client.id).emit('message', `${gptResponse[0]}`);
      } else {
        console.log("Client does not exist in the set.");
        payload = { topic: message };
        gptResponse = await this.openaiService.processGptChat(payload);
        this.server.to(client.id).emit('prompts', `${JSON.stringify(convertResponseToArray(gptResponse[0]))}`);
        this.clients.add(client.id);
        this.logger.log(`✅ Client added: ${client.id}`);
      }
      console.log('gptResponse', convertResponseToArray(gptResponse[0]));
      // this.chatQueueService.addMessageJob(message, client.id);
    } catch (error) {
      this.logger.error(error);
    }

  }


}
