const searchService = require('./search-service');
const { errorResponder, errorTypes } = require('../../core/errors');

async function searchUsers(request, response, next) {
  try {
    const { q } = request.query;

    if (!q) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Query is required');
    }

    const users = await searchService.searchUsers(q);

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function searchThreads(request, response, next) {
  try {
    const { q } = request.query;

    if (!q) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Query is required');
    }

    const threads = await searchService.searchThreads(q);

    return response.status(200).json(threads);
  } catch (error) {
    return next(error);
  }
}

async function getFollowing(request, response, next) {
  try {
    const user = await searchService.getFollowing(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    return response.status(200).json(user.following);
  } catch (error) {
    return next(error);
  }
}

async function getFollowers(request, response, next) {
  try {
    const user = await searchService.getFollowers(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    return response.status(200).json(user.followers);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  searchUsers,
  searchThreads,
  getFollowing,
  getFollowers,
  errorResponder,
  errorTypes,
};
