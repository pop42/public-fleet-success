import * as Joi from '@hapi/joi'

export default () => ({
  validationSchema: Joi.object({
    APP_PORT: Joi.required(),
    EVENTSTORE_CONNECTION_STRING: Joi.required(),
    ELASTICSEARCH_NODE: Joi.required(),
    COGNITO_USER_POOL_ID: Joi.required(),
    COGNITO_CLIENT_ID: Joi.required(),
    COGNITO_REGION: Joi.required(),
  }),
})
