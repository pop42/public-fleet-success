import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import 'source-map-support/register'
import { ConfigService } from '@nestjs/config'
import { APP_PORT } from './constants'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import * as winston from 'winston'

async function bootstrap() {
  // The main application
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        // other transports...
      ],
      // other options
    }),
  })

  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  const options = new DocumentBuilder()
    .setTitle('Fleet Success')
    .setDescription('RTAs Fleet Success Application')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('api', app, document)

  await app.listen(configService.get(APP_PORT))
}

bootstrap()
