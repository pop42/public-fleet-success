export class ApiSearchResults<T> {
  readonly results: T[]

  readonly count: number

  readonly totalCount: number

  constructor(results: T[], count: number, totalCount: number) {
    this.results = results
    this.count = count
    this.totalCount = totalCount
  }
}
