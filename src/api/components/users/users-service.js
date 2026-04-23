const usersRepository = require('./users-repository');
const { generateToken } = require('../../middleware/auth');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function register(username, email, password) {
  if (await usersRepository.findByEmail(email)) throw new Error('EMAIL_TAKEN');
  if (await usersRepository.findByUsername(username)) throw new Error('USERNAME_TAKEN');

  const hashedPassword = await hashPassword(password);

  const user = await usersRepository.createUser({ 
    username, 
    email, 
    password: hashedPassword,
    profilePhoto: null,     
    isPrivate: false,       
    createdAt: new Date(),
    updatedAt: new Date()   
  });
  const token = generateToken(user._id, user.username);
  return { token, userId: user._id };
}

async function login(email, password) {
  const user = await usersRepository.findByEmail(email);
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const isMatch = await passwordMatched(password, user.password);
  if (!isMatch) throw new Error('INVALID_CREDENTIALS');

  const token = generateToken(user._id, user.username);
  return { token, userId: user._id, username: user.username };
}

async function getProfile(username) {
  return usersRepository.findByUsername(username);
}

async function updateProfile(userId, updateData) {
  const dataToUpdate = {
    ...updateData,
    updatedAt: new Date()
  };
  return usersRepository.updateProfile(userId, dataToUpdate);
}

module.exports = { register, login, getProfile, updateProfile };