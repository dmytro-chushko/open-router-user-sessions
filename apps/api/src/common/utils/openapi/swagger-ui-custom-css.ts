/**
 * Swagger UI overrides. Cookie session auth has no manual value — login sets Set-Cookie.
 */
export const SWAGGER_UI_CUSTOM_CSS = `
.swagger-ui .topbar { display: none }

.swagger-ui .dialog-ux .modal-ux-content .auth-container input[type="text"] {
  display: none !important;
}

.swagger-ui .dialog-ux .modal-ux-content .auth-container .wrapper label[for] {
  display: none !important;
}


`.trim();
