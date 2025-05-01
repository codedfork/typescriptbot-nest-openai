import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ChatQueueService {
    constructor(
        @InjectQueue('chat-messages') private readonly chatQueue: Queue,
    ) { }

    async addMessageJob(message: string, clientId: string) {
        await this.chatQueue.add('process-message', { message, clientId });
    }
}
