// src/redis/redis-monitor.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisMonitorService implements OnModuleInit {
    private readonly logger = new Logger(RedisMonitorService.name);
    private monitorClient: Redis;

    onModuleInit() {
        this.monitorClient = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6380,
            password: process.env.REDIS_PASSWORD,
            tls: {},
        });

        // this.startMonitoring();
    }

    private startMonitoring() {
        this.monitorClient.monitor((err: any, monitor: any) => {
            if (err) {
                this.logger.error('Error starting Redis monitor', err);
                return;
            }
            this.logger.log('Redis monitoring started...');
            monitor.on('monitor', (time: any, args: any, source: any, database: any) => {
                const timestamp = new Date(time * 1000).toISOString();
                this.logger.debug(`[${timestamp}] ${args.join(' ')}`);
            });
        });
    }
}
