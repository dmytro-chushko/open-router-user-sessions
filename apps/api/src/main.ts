import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';
import { contract } from '@repo/api-contracts';
import { AppModule } from './app.module';
import { AppConfigService } from './common/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const appConfig = app.get(AppConfigService);

  app.enableCors({
    origin: appConfig.webOrigins,
    credentials: true,
  });

  const openApiDocument = generateOpenApi(
    contract,
    {
      info: {
        title: 'API',
        version: '1.0.0',
      },
      servers: [
        {
          url: appConfig.apiUrl,
          description: 'API Server',
        },
      ],
    },
    { setOperationId: true },
  );

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    }),
  );

  await app.listen(appConfig.port);
}
void bootstrap();
