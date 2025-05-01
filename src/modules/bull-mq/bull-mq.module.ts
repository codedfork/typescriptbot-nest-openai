import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ChatQueueService } from './chat-queue.service';
import { ChatMessageProcessor } from './chat-messages.processor';
import { OpenaiService } from '../openai/openai.service';
import { Server } from 'socket.io';
import { ChatGateway } from '../websocket/chat.gateway';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT) || 6380,
                password: process.env.REDIS_PASSWORD,
                tls: {},
            },
        }),
        BullModule.registerQueue({
            name: 'chat-messages',
        }),
    ],
    providers: [ChatQueueService, ChatMessageProcessor, OpenaiService, Server, ChatGateway],
    exports: [BullModule, ChatQueueService],
})
export class BullMqModule { }
