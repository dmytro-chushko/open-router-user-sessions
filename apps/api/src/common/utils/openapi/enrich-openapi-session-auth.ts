import type { generateOpenApi } from '@ts-rest/open-api';

export const SESSION_COOKIE_SECURITY_SCHEME = 'sessionCookie' as const;

type OpenApiDocument = ReturnType<typeof generateOpenApi>;

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type OpenApiOperation = {
  security?: Array<Record<string, string[]>>;
};

type OpenApiPathItem = Partial<Record<HttpMethod, OpenApiOperation>>;

type OpenApiPaths = Record<string, OpenApiPathItem | undefined>;

function readOpenApiOperation(
  paths: OpenApiPaths | undefined,
  path: string,
  method: HttpMethod,
): OpenApiOperation | undefined {
  return paths?.[path]?.[method];
}

const PROTECTED_OPERATIONS: ReadonlyArray<{
  path: string;
  method: HttpMethod;
}> = [
  { path: '/users/me', method: 'get' },
  { path: '/users/me', method: 'patch' },
  { path: '/users/me/avatar/upload-intent', method: 'post' },
  { path: '/users/me/avatar/confirm', method: 'post' },
  { path: '/users/me/avatar', method: 'delete' },
  { path: '/auth/logout', method: 'post' },
];

/**
 * Adds OpenAPI cookie security scheme and marks session-protected auth routes.
 */
export function enrichOpenApiSessionAuth(
  document: OpenApiDocument,
  cookieName: string,
): OpenApiDocument {
  document.components ??= {};
  document.components.securitySchemes = {
    ...document.components.securitySchemes,
    [SESSION_COOKIE_SECURITY_SCHEME]: {
      type: 'apiKey',
      in: 'cookie',
      name: cookieName,
      description:
        'HttpOnly session cookie. Set by POST /auth/login (Set-Cookie). ' +
        'In Swagger UI: run login first, then call protected routes (withCredentials must be enabled). ' +
        'Email must be verified before login succeeds.',
    },
  };

  const paths = document.paths as OpenApiPaths | undefined;

  for (const { path, method } of PROTECTED_OPERATIONS) {
    const operation = readOpenApiOperation(paths, path, method);

    if (operation === undefined) {
      continue;
    }

    operation.security = [{ [SESSION_COOKIE_SECURITY_SCHEME]: [] }];
  }

  const login = readOpenApiOperation(paths, '/auth/login', 'post');

  if (login !== undefined) {
    login.security = [];
  }

  return document;
}
