const _ = require('lodash')
const jwt = require('jsonwebtoken')
const utils = require('../lib/utils')

// Returns a boolean whether or not a user is allowed to call a particular method
// A user with scopes: ['pangolins'] can
// call 'arn:aws:execute-api:ap-southeast-1::random-api-id/dev/GET/pangolins'
const authorizeUser = (userScopes, methodArn) => {
  const hasValidScope = _.some(userScopes, scope => _.endsWith(methodArn, scope))
  return hasValidScope
}

/**
  * Authorizer functions are executed before your actual functions.
  * @method authorize
  * @param {String} event.authorizationToken - JWT
  * @throws Returns 401 if the token is invalid or has expired.
  * @throws Returns 403 if the token does not have sufficient permissions.
  */
module.exports.handler = (event, context, callback) => {
  const token = event.authorizationToken

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = decoded.user

    // Checks if the user's scopes allow her to call the current function
    const isAllowed = authorizeUser(user.scopes, event.methodArn)

    const effect = isAllowed ? 'Allow' : 'Deny'
    const userId = user.username
    const authorizerContext = { user: JSON.stringify(user) }
    // Return an IAM policy document for the current endpoint
    const policyDocument = utils.buildIAMPolicy(userId, effect, event.methodArn, authorizerContext)

    callback(null, policyDocument)
  } catch (e) {
    callback(new Error('Unauthorized')) // Return a 401 Unauthorized response
  }
}
