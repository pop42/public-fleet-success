import { EventstoreConnectOptions } from './EventstoreConnectOptions'

export interface EventstoreOptionsFactory {
  createEventstoreConnectOptions():
    | Promise<EventstoreConnectOptions>
    | EventstoreConnectOptions
}
