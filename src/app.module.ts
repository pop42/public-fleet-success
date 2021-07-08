import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventstoreModule } from './common/eventstore/eventstore.module'
import { CompaniesModule } from './companies/companies.module'
import { ElasticModule } from './common/elastic/elastic.module'

import configuration from './config'

import { UsersModule } from './users/users.module'
import { EVENTSTORE_CONNECTION_STRING } from './constants'
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
    }),
    EventstoreModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        connectionString: configService.get(EVENTSTORE_CONNECTION_STRING),
      }),
      inject: [ConfigService],
    }),
    CompaniesModule,
    ElasticModule,
    UsersModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
