import path from 'path'
import Jimp from 'jimp'
import { NotAcceptable, BadRequest, NotFound } from 'fejl'
import randomWords from 'random-words';
import fs from 'fs'
import util from 'util'

import { Duplex } from 'stream'

import { isValidPhotoBody, isValidPhotoRequestBody } from '@helpers/validators'

// Psuedo random string
async function randomStr(): Promise<string> {
  const words = randomWords({ exactly: 2, join: '-', maxLength: 3 })

  return `${words}-${Date.now().toString(36)}`
}

// Allowed file extensions
const allowed = ['jpeg', 'jpg', 'png', 'bmp', 'tiff', 'gif']

export default {
  async add({ filePath, name, type }): Promise<string> {

    // Check for all parts of the request
    BadRequest.assert(filePath && name && type, 'You did not include all parts of the file')

    // Type checking
    BadRequest.assert(isValidPhotoBody(filePath, name, type), 'You did give the correct types')

    // Super easy type checking using mime types
    type = type.split('/')
    NotAcceptable.assert(type[0] === 'image', 'You did not upload an image')

    // Make sure its a valid type for jimp
    const extension = name.split('.')[1].toLowerCase()
    NotAcceptable.assert(allowed.includes(extension), 'You did not give a supported file type.')

    // Make a cool name
    name = `${await (await randomStr()).toUpperCase()}-${name.toUpperCase()}`

    // Define the save path
    // TODO: Don't use so many '..'
    const savePath = path.join(__dirname, `../../../photos/${name}`)

    // Image manipulation to resize the image to 512 pixels wide and keep the aspect ratio
    const img = await Jimp.read(filePath)
    await img.resize(512, Jimp.AUTO)

    // Write the file
    await img.writeAsync(savePath)

    // Return the cool name
    return name
  },
  async get({ name, size }): Promise<void | Duplex> {

    // Check for all parts of the request
    BadRequest.assert(name && size, 'You did not include all parts of the file')

    // Convert size to an int
    size = parseInt(size, 10)

    // Type checking
    BadRequest.assert(isValidPhotoRequestBody(name, size), 'You did not provide the correct types')

    // Original path of photo
    // TODO: Clean this up
    const orgPath = path.join(__dirname, `../../../photos/${name}`)
    
    // Check to see if the file exists
    NotFound.assert(fs.existsSync(orgPath), 'The file does not exist')

    const read = util.promisify(fs.readFile)
    const stream =  read(orgPath).then((res) => {
      return Jimp.read(res)
    }).then((img) => {
      const i = img.resize(size, Jimp.AUTO)
      const b = util.promisify(i.getBuffer.bind(i))
      return b(Jimp.MIME_PNG)
    }).then(async (buff) => {
      const s = new Duplex()
      s.push(buff)
      s.push(null)
      return s
    }).catch((err) => {
      BadRequest.assert(!err, 'The image converstion failed')
    })

    return stream
  },
  async delete({ name }): Promise<string> {
    // Check for all parts of the request
    BadRequest.assert(name, 'You did not include all parts of the file')
  
    // Type checking
    BadRequest.assert(typeof name === 'string', 'The types for the delete request were wrong')
    
    // Path of file
    const orgPath = path.join(__dirname, `../../../photos/${name}`)

    // Check to see if the file exists
    NotFound.assert(fs.existsSync(orgPath), 'The file does not exist')

    // Delete the file
    try {
      fs.unlinkSync(orgPath)
    } catch (err) {
      BadRequest.assert(!err, 'There was an issue with deleting the file')
    }

    return name
  }

}