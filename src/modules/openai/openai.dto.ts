import { IsNotEmpty, IsString } from 'class-validator';

export class OpenaiDtoChat {
    @IsNotEmpty()
    @IsString()
    textContent: string;
}

export class OpenaiDtoPrompt {
    @IsNotEmpty()
    @IsString()
    topic: string;
}
