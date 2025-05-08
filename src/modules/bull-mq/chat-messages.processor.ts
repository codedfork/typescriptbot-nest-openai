// chat/chat.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, forwardRef, Inject } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { ChatGateway } from '../websocket/chat.gateway';
import { IOpenaiTextContent } from '../openai/openai.interface';

@Processor('chat-messages')
export class ChatMessageProcessor extends WorkerHost {
    private readonly logger = new Logger(ChatMessageProcessor.name);

    constructor(private readonly openaiService: OpenaiService, @Inject(forwardRef(() => ChatGateway)) // Inject your gateway to emit to the client
    private readonly chatGateway: ChatGateway) {
        super();
    }

    async process(job: Job<any>) {
        const { message, clientId } = job.data;
        this.logger.log(`Processing job: ${JSON.stringify(message)} ${JSON.stringify(clientId)}`);


        // Here you can call OpenAI or handle DB/cache logic
        //Generating gpt response
        const payload: IOpenaiTextContent = { textContent: message };

        const gptResponse = await this.openaiService.processGptChat(payload);
        this.chatGateway.server.to(clientId).emit('message', `${gptResponse}`);

        this.logger.log(`Processed job: ${gptResponse}`);

    }
}
