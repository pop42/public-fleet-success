import { ModuleMetadata, Type } from '@nestjs/common'
import { EventstoreOptionsFactory } from './EventstoreOptionsFactory'

export interface EventstoreAsyncConnectOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useExisting?: Type<EventstoreOptionsFactory>
  useClass?: Type<EventstoreOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<EventstoreConnectOptions> | EventstoreConnectOptions
}

export interface EventstoreConnectOptions {
  connectionString: string
}
