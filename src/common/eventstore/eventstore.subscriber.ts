import { STREAM_NAME } from '@eventstore/db-client'
import { Client } from '@eventstore/db-client/dist/Client'

export class EventstoreSubscriber {
  private streamName!: string
  private handlers: any
  private subscriberId!: string
  private originStreamName?: string | null
  private subscriberStreamName!: string
  private isSubscribed = false

  constructor(private readonly client: Client) {}

  subscribe = (args: {
    streamName: string
    handlers: any
    subscriberId: string
    messagesPerTick?: number
    positionUpdateInterval?: number
    originStreamName?: string
    tickIntervalMs?: number
  }) => {
    this.streamName = args.streamName
    this.handlers = args.handlers
    this.subscriberId = args.subscriberId
    this.originStreamName = args.originStreamName || null
    // this.subscriberStreamName = `subscriberPosition-${args.subscriberId}`
    this.isSubscribed = true
    return this
  }

  start = async () => {
    if (this.isSubscribed) {
      const subscription = this.subscribeToCategory()
      console.info(
        `${this.subscriberId} subscribed to category: ${this.streamName}`,
      )
      return subscription
    }
    return true
  }

  private handleMessage = async (message: any) => {
    const handler = this.handlers[message.event?.type]
    return handler ? handler(message.event) : true
  }

  private subscribeToCategory = () =>
    this.client
      .subscribeToAll({
        filter: {
          filterOn: STREAM_NAME,
          prefixes: [`${this.streamName}-`],
          checkpointInterval: 1000,
        },
      })
      .on('data', this.handleMessage)
}
