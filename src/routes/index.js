const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
  strict: true,
});

// Example API route
/**
 * @swagger
 * tags:
 *   name:  Root
 *   description: Root api documentation
 */
/**
/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a greeting message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/hello", async (ctx) => {
  ctx.body = { message: "Hello, Swagger!" };
});

module.exports = router;
