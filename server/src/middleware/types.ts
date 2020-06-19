import { Context as KoaContext } from 'koa'
export interface Context extends KoaContext {
  user: {
    [key: string]: any
  }
}
