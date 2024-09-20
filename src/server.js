const Koa = require("koa");
const jwt = require("koa-jwt");
const { koaBody } = require("koa-body");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const swaggerJsdoc = require("swagger-jsdoc");
const { koaSwagger } = require("koa2-swagger-ui");
const route = require("./routes");
const app = new Koa();

// Swagger definition (Swagger JSDoc options)
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Koa Swagger API",
    version: "1.0.0",
    description: "API documentation generated using swagger-jsdoc for Koa.js",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using the Bearer scheme.",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Path to your API definition files (e.g., routes folder)
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI
app.use(
  koaSwagger({
    routePrefix: "/swagger", // host Swagger UI at /swagger
    swaggerOptions: {
      spec: swaggerSpec, // Generated Swagger specification
      persistAuthorization: true,
    },
  })
);

// Middleware
app.use(koaBody({}));
app.use(helmet());
app.use(cors());

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});
app.use(route.routes()).use(route.allowedMethods());
app.on("error", (err, ctx) => {
  console.error("Server error", err);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/swagger`);
});
