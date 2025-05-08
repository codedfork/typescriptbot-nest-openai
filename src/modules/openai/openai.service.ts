import { Injectable } from '@nestjs/common';
import { AzureOpenAI } from "openai";
import * as dotenv from "dotenv";
import { IOpenaiTextContent } from './openai.interface';
import { ConfigService } from '@nestjs/config';
dotenv.config();

@Injectable()
export class OpenaiService {

    // Process the chat and return the response
    private readonly endpoint: string;
    private readonly modelName: string;
    private readonly deployment: string;
    private readonly apiKey: string;
    private readonly apiVersion: string;
    private readonly options: any;

    constructor(private readonly configService: ConfigService) {
        this.endpoint = this.configService.get<string>('openai.endpoint') || 'default-endpoint';
        this.modelName = this.configService.get<string>('openai.modelName') || 'default-model-name';
        this.deployment = this.configService.get<string>('openai.deployment') || 'default-deployment';
        this.apiKey = this.configService.get<string>('openai.apiKey') || 'default-api-key';
        this.apiVersion = this.configService.get<string>('openai.apiVersion') || 'default-api-version';
        this.options = {
            apiKey: this.apiKey,
            endpoint: this.endpoint,
            deployment: this.deployment,
            apiVersion: this.apiVersion,
        };
    }
    async processGptChat(payload: IOpenaiTextContent) {
        const client = new AzureOpenAI(this.options);

        if (payload.hasOwnProperty('topic'))
            payload.textContent = `Generate 5 best short prompts about topic travel in the form of a question.`;
        else if (payload.hasOwnProperty('textContent'))
            payload.textContent = `${payload.textContent}`;
        else
            throw new Error("Invalid payload. Must contain either 'topic' or 'textContent'.");
        const response: any = await client.chat.completions.create({
            messages: [
                { role: "user", content: payload.textContent }
            ],
            max_tokens: 4096,
            temperature: 1,
            top_p: 1,
            model: this.modelName
        });

        if (response?.error !== undefined && response.status !== "200") {
            throw response.error;
        }
        return response.choices.map((choice: any) => choice.message.content);
    }

}
