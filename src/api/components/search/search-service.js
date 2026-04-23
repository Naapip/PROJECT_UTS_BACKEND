const searchRepository = require('./search-repository');

async function searchUsers(q) {
  return searchRepository.searchUsers(q);
}

async function searchThreads(q) {
  return searchRepository.searchThreads(q);
}

async function getFollowing(id) {
  return searchRepository.getFollowing(id);
}

async function getFollowers(id) {
  return searchRepository.getFollowers(id);
}

module.exports = {
  searchUsers,
  searchThreads,
  getFollowing,
  getFollowers,
};
