import { IsNotEmpty, IsString } from 'class-validator';

export class OpenaiDto {
    @IsNotEmpty()
    @IsString()
    textContent: string;
}