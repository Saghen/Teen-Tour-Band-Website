import path from 'path'

function getRootDir(): string {
  return path.join(__dirname, '../../')
}

export default getRootDir
