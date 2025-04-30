import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiDto } from './openai.dto';
import { IOpenaiTextContent } from './openai.interface';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openAiService: OpenaiService) {

    }

    @Post('chat')
    async chat(@Body() openAiDto: OpenaiDto) {
        try {
            const payload: IOpenaiTextContent = { textContent: openAiDto.textContent };
            const result = await this.openAiService.processGpt(payload);
            return { statusCode: 200, message: 'Success', data: result };
        } catch (error) {
            return { statusCode: 500, message: 'Internal Server Error', error: error.message };
        }
    }

}
