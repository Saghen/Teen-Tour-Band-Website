import path from 'path'
import Jimp from 'jimp'
import { NotAcceptable, BadRequest, Conflict, NotFound } from 'fejl'
import randomWords from 'random-words';
import fs from 'fs'

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
  async get({ name, size }): Promise<fs.ReadStream> {
    /* 
      TODO:
       - Delete file after x amount of minutes
       - Clean it up
    */

    // Convert size to an int
    size = parseInt(size, 10)

    // Type checking
    BadRequest.assert(isValidPhotoRequestBody(name, size), 'You did not provide the correct types')

    const tempPath = path.join(__dirname, `../../../photos/temp/${`${size.toString(36) }-${  name}`}`)
    const orgPath = path.join(__dirname, `../../../photos/${name}`)

    const img = await Jimp.read(orgPath)
    await img.resize(size, Jimp.AUTO)

    await img.writeAsync(tempPath)

    const stream = fs.createReadStream(tempPath)

    stream.on('error', (err) => {
      console.error(err);
    })

    return stream
  }

}