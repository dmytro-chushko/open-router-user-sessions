import 'tsconfig-paths/register';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { contract } from '@repo/api-contracts';
import { generateOpenApi } from '@ts-rest/open-api';
import cookieParser from 'cookie-parser';
import * as swaggerUi from 'swagger-ui-express';

import { AppModule } from '@/app.module';
import { AppConfigService } from '@/common/app-config.service';
import { enrichOpenApiSessionAuth } from '@/common/utils/openapi/enrich-openapi-session-auth';
import { SWAGGER_UI_CUSTOM_CSS } from '@/common/utils/openapi/swagger-ui-custom-css';

async function bootstrap() {
  const logger = new Logger('MainBootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const appConfig = app.get(AppConfigService);

  app.enableCors({
    origin: appConfig.webOrigins,
    credentials: true,
  });

  const openApiDocument = enrichOpenApiSessionAuth(
    generateOpenApi(
      contract,
      {
        info: {
          title: 'API',
          version: '1.0.0',
          description:
            'Session auth: POST /auth/login sets an HttpOnly cookie; ' +
            'GET /users/me and POST /auth/logout require it. OAuth is browser-only (not in this spec).',
        },
        servers: [
          {
            url: `${appConfig.apiUrl}/api`,
            description: 'API Server',
          },
        ],
      },
      { setOperationId: true },
    ),
    appConfig.sessionCookieName,
  );

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customCss: SWAGGER_UI_CUSTOM_CSS,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        withCredentials: true,
      },
    }),
  );

  logger.log(
    `🚀 API Docs running on http://localhost:${appConfig.port}/api-docs`,
  );

  await app.listen(appConfig.port);
  logger.log(`🚀 API running on ${appConfig.apiUrl}`);
}
void bootstrap();
