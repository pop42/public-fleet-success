import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

import { ElasticClientService } from './elastic-client/elastic-client.service'
import { ELASTICSEARCH_NODE } from '../../constants'

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get(ELASTICSEARCH_NODE),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticClientService],
  providers: [ElasticClientService],
})
export class ElasticModule {}
