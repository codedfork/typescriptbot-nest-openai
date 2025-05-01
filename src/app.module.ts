import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './modules/openai/openai.module';
import { ChatGateway } from './modules/websocket/chat.gateway';
import { OpenaiService } from './modules/openai/openai.service';

@Module({
  imports: [OpenaiModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, OpenaiService],
})
export class AppModule { }
