import Koa from 'koa';

/**
 * Let the user know nothing was found here.
 */
export default async function notFoundHandler(ctx: Koa.Context): Promise<void> {
  const msg = `${ctx.request.method} ${ctx.request.path}`
  ctx.notFound({
    message: `No endpoint matched your request: ${msg}`,
  })
}
