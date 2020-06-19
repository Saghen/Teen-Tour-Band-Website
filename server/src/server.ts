import 'module-alias/register'
import config from '@config'

import connectMongo from '@db/connect'
import { createAPIServer } from '@lib/api-server'

import logger, { waitForLogger } from '@logger'

connectMongo()
createAPIServer()
  .then((app) =>
    app.listen(config.get('api.port'), () => {
      logger.api.info(`Listening on ${config.get('api.port')} in ${config.get('env')} mode`)
    })
  )
  .catch(async (err) => {
    logger.api.error('Error while starting up the server')
    logger.api.error(err.stack)
    await waitForLogger(logger.api)
    process.exit(1)
  })
