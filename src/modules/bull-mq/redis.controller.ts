import { Controller, Get, Query } from '@nestjs/common';
import { RedisInspectService } from './redis-inspect-service';

@Controller('redis')
export class RedisController {
    constructor(private readonly redisService: RedisInspectService) { }

    @Get('keys')
    async getAllKeys(@Query('pattern') pattern?: string) {
        return this.redisService.getAllKeys(pattern || '*');
    }

    @Get('value')
    async getValue() {
        return this.redisService.getValueByKey("bull:chat-messages:events");
    }

    @Get('all')
    async getAllKeysWithValues(@Query('pattern') pattern?: string) {
        return this.redisService.getAllKeysWithValues(pattern || '*');
    }
}
