import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { EventstoreService } from './eventstore.service'
import { EVENTSTORE_CONNECT_OPTIONS } from './constants'
import { EventstoreAsyncConnectOptions } from './interfaces/EventstoreConnectOptions'
import { EventstoreOptionsFactory } from './interfaces/EventstoreOptionsFactory'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  providers: [EventstoreService],
  imports: [ConfigModule],
})
export class EventstoreModule {
  public static registerAsync(
    connectOptions: EventstoreAsyncConnectOptions,
  ): DynamicModule {
    return {
      module: EventstoreModule,
      imports: connectOptions.imports,
      providers: [
        EventstoreService,
        this.createConnectProviders(connectOptions),
      ],
      exports: [EventstoreService],
    }
  }

  private static createConnectProviders(
    options: EventstoreAsyncConnectOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: EVENTSTORE_CONNECT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    // For useClass and useExisting...
    return {
      provide: EVENTSTORE_CONNECT_OPTIONS,
      useFactory: async (optionsFactory: EventstoreOptionsFactory) =>
        await optionsFactory.createEventstoreConnectOptions(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
