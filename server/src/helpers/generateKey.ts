import fs from 'fs'
import paseto from 'paseto'
import path from 'path'

import getRootDir from './get-root-dir.js'

async function generateKey() {
  const key = (await paseto.V2.generateKey('local')).export()

  const config = { auth: { secret: { type: 'Buffer', data: Array.from(key) } } }

  fs.writeFileSync(path.join(getRootDir(), 'src/config/configs/key.json'), JSON.stringify(config))
}

generateKey()
