import { Inject, Injectable } from '@nestjs/common'
import { EVENTSTORE_CONNECT_OPTIONS } from './constants'
import {
  ErrorType,
  EventData,
  EventStoreDBClient,
  ResolvedEvent,
} from '@eventstore/db-client'
import { Client } from '@eventstore/db-client/dist/Client'
import { EventstoreSubscriber } from './eventstore.subscriber'
import { EventstoreConnectOptions } from './interfaces/EventstoreConnectOptions'
import * as _ from 'lodash'

@Injectable()
export class EventstoreService {
  private client: Client

  constructor(
    @Inject(EVENTSTORE_CONNECT_OPTIONS)
    options: EventstoreConnectOptions,
  ) {
    this.client = EventStoreDBClient.connectionString(options.connectionString)
  }

  /**
   * Subscribers to a stream by $correlationId and returns when a completion event is found
   * @param correlationId
   * @param completionEvents
   */
  waitForIt = async (
    correlationId: string,
    completionEvents: Record<string, boolean>,
  ): Promise<ResolvedEvent> =>
    new Promise(async (resolve, reject) => {
      const subscription = this.client.subscribeToStream(
        `$bc-${correlationId}`,
        { resolveLinkTos: true },
      )

      const handler = (resolvedEvent: ResolvedEvent) => {
        if (_.includes(_.keys(completionEvents), resolvedEvent.event!.type)) {
          subscription.unsubscribe()
          return resolve(resolvedEvent)
        }
      }

      subscription.on('data', handler)

      subscription.on('error', (error: any) => {
        subscription.unsubscribe()
        return reject(error)
      })
    })

  /**
   * Returns the fully hydrated projections of an entity stream
   * @param streamName
   * @param projection
   */
  fetch = async <T>(
    streamName: string,
    projection: Record<string, unknown>,
  ) => {
    try {
      const events = await this.client.readStream(streamName, {})
      return this.project<T>(events, projection)
    } catch (error) {
      if (error.type == ErrorType.STREAM_NOT_FOUND) return
      throw error
    }
  }

  /**
   * Writes an event to the eventstore
   * @param streamName
   * @param eventData
   */
  write = async (streamName: string, eventData: EventData) =>
    await this.client.appendToStream(streamName, eventData)

  /**
   * Subscribes to streams
   * @param streamName
   * @param handlers
   * @param subscriberId
   * @param originStreamName
   */
  subscribe = ({
    streamName,
    handlers,
    subscriberId,
    originStreamName,
  }: {
    streamName: string
    handlers: Record<string, unknown>
    subscriberId: string
    originStreamName?: string
  }) =>
    new EventstoreSubscriber(this.client).subscribe({
      streamName,
      handlers,
      subscriberId,
      originStreamName,
    })

  /**
   * Returns the hydrated projections for a set of interfaces
   * @param events
   * @param projection
   */
  project = async <T>(events: any[], projection: any) => {
    return events.reduce((entity, { event }) => {
      if (!projection[event.type]) {
        return entity
      }

      return projection[event.type](entity, event)
    }, projection.init()) as T
  }
}
