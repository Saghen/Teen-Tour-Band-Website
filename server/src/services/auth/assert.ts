import { Forbidden, MakeErrorClass } from 'fejl'

const assertInvalidToken = Forbidden.makeAssert('The token is invalid')
const assertNotLoggedIn = Forbidden.makeAssert('You must be logged in')
const assertNotValidEndpoint = Forbidden.makeAssert('That endpoint is incorrect')
const assertNotAuthorized = Forbidden.makeAssert('You are not authorized to access this endpoint')
const assertMustBeAdmin = Forbidden.makeAssert('You must be an admin')

export class MongoError extends MakeErrorClass('There was an error with mongo') { }

export { assertInvalidToken, assertNotLoggedIn, assertNotValidEndpoint, assertNotAuthorized, assertMustBeAdmin }
