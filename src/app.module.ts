import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './modules/openai/openai.module';
import { OpenaiService } from './modules/openai/openai.service';
import { BullMqModule } from './modules/bull-mq/bull-mq.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [OpenaiModule, BullMqModule, ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule { }
