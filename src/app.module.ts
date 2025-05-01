import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './modules/openai/openai.module';
import { ChatGateway } from './modules/websocket/chat.gateway';
import { OpenaiService } from './modules/openai/openai.service';
import { BullMqModule } from './modules/bull-mq/bull-mq.module';

@Module({
  imports: [OpenaiModule, BullMqModule],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule { }
