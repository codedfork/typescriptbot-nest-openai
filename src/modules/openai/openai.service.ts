import { Injectable } from '@nestjs/common';
import { AzureOpenAI } from "openai";
import * as dotenv from "dotenv";
import { IOpenaiTextContent } from './openai.interface';
dotenv.config();

@Injectable()
export class OpenaiService {
    async processGpt(payload: IOpenaiTextContent) {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://<your-resource-name>.openai.azure.com/";
        const modelName = process.env.AZURE_OPENAI_MODEL_NAME || "gpt-4o-mini";
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini-deployment";
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2023-05-15";
        const options = { endpoint, apiKey, deployment, apiVersion }

        const client = new AzureOpenAI(options);

        const response: any = await client.chat.completions.create({
            messages: [

                { role: "user", content: payload.textContent }
            ],
            max_tokens: 4096,
            temperature: 1,
            top_p: 1,
            model: modelName
        });

        if (response?.error !== undefined && response.status !== "200") {
            throw response.error;
        }
        return response.choices.map((choice: any) => choice.message.content);
    }
}
