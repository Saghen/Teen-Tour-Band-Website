function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return target
}

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  api: {
    ssl: false,
    domain: 'localhost:8081',
    getUrl(): string {
      return `${this.ssl ? 'https://' : 'http://'}${this.domain}`
    }
  },
  ws: {
    domain: 'localhost:8080',
    getUrl(): string {
      return `${this.ssl ? 'https://' : 'http://'}${this.domain}`
    }
  }
}

const productionConfig = {
  api: {
    ssl: true,
    domain: 'api.example.com'
  },
  ws: {
    domain: 'ws.example.com'
  }
}

let combinedConfig = config
if (isProduction) combinedConfig = mergeDeep(config, productionConfig)

export default combinedConfig
