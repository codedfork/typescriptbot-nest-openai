import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiDtoChat, OpenaiDtoPrompt } from './openai.dto';
import { IOpenaiTextContent } from './openai.interface';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openAiService: OpenaiService) {

    }

    @Post('chat')
    async chat(@Body() openAiDto: OpenaiDtoChat) {
        try {
            const payload: IOpenaiTextContent = { textContent: openAiDto.textContent };
            const result = await this.openAiService.processGptChat(payload);
            return { statusCode: 200, message: 'Success', data: result };
        } catch (error) {
            return { statusCode: 500, message: 'Internal Server Error', error: error.message };
        }
    }

    @Post('prompt')
    async prompt(@Body() openAiDto: OpenaiDtoPrompt) {
        try {
            const payload: IOpenaiTextContent = { topic: openAiDto.topic };
            const result = await this.openAiService.processGptChat(payload);
            return { statusCode: 200, message: 'Success', data: result };
        } catch (error) {
            return { statusCode: 500, message: 'Internal Server Error', error: error.message };
        }
    }

}
