export class ApiEntityResponseDto {
  readonly entityId: string

  readonly correlationId: string

  constructor(entityId: string, correlationId: string) {
    this.entityId = entityId
    this.correlationId = correlationId
  }
}
