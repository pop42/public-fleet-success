import { ResolvedEvent } from '@eventstore/db-client'

export class RawEvent<T> {
  private resolvedEvent: ResolvedEvent

  constructor(resolvedEvent: ResolvedEvent) {
    this.resolvedEvent = resolvedEvent
  }

  get event() {
    return this.resolvedEvent.event!
  }

  get metadata() {
    return this['metadata'] || {}
  }

  get data() {
    return this.event.data as T
  }

  get streamId() {
    return this.event.streamId
  }

  get globalPosition() {
    return this.resolvedEvent.commitPosition
  }

  get link() {
    return this.resolvedEvent.link
  }

  get revision() {
    return this.event.revision
  }
}
