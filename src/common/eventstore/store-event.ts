import { JSONEventData } from '@eventstore/db-client'
import { Metadata } from '../interfaces'

export class StoreEvent<T> {
  eventData: JSONEventData

  constructor(eventData: JSONEventData) {
    this.eventData = eventData
  }

  get data() {
    return this.eventData.data as T
  }

  get metadata() {
    return this.eventData.metadata as Metadata
  }
}
