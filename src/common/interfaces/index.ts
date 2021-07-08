export type Metadata = Record<string, unknown> & {
  $correlationId: string
  originStreamName?: string
}
export type IsSuccess = boolean
