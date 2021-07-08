import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import * as esb from 'elastic-builder'
import * as _ from 'lodash'
import { elasticConstants } from '../constants'
import { ApiSearchResults } from '../../dto/created.dto'

@Injectable()
export class ElasticClientService {
  constructor(private elasticService: ElasticsearchService) {}

  upsert = async <T>(params: {
    index: string
    routing: string
    id: string
    body: T
  }) => await this.elasticService.index(params)

  fetchById = async <T>(params: {
    index: string
    routing: string
    id: string
  }) =>
    this.elasticService
      .get(params)
      .then((results) => results.body._source as T)
      .catch((error) => {
        if (error.meta.statusCode === HttpStatus.NOT_FOUND) {
          throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        throw new HttpException(error.message, error.meta.statusCode)
      })

  search = async <T>(params: {
    index: string
    routing: string
    search: string
    sortBy: string
    offset?: number
    limit?: number
  }) => {
    const { index, routing, search, sortBy, offset = 0, limit = 1000 } = params

    const requestBody = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .should(esb.queryStringQuery(search))
          .filter(esb.termQuery(elasticConstants.routing, routing)),
      )
      .from(offset)
      .size(limit)
      .trackScores(true)
      .trackTotalHits(true)

    const searchResults = await this.elasticService.search({
      index,
      routing,
      body: requestBody,
    })

    const results = _.map(
      _.get(searchResults, elasticConstants.searchResults, []),
      (hits) => hits._source as T,
    )

    const totalCount = _.get(searchResults, elasticConstants.searchTotalCount)
    return new ApiSearchResults<T>(results, results.length, totalCount)
  }
}
