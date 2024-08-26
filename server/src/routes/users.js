const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');
const jwtAuth = passport.authenticate('jwt', { session: false });
const User = require('../models/users');

const router = express.Router();

router.get('/currentuser', jwtAuth, (async (req, res) => {
  res.json(renderFields(req.user));
}));

router.post('/signup', async (req, res) => {
  try {
    let newUser = req.body;

    const userExist = await User.find()
      .or([{ username: newUser.username }, { email: newUser.email }])
      .then(users => users.length > 0);

    if (userExist) {
      console.log(
        `Email [${newUser.email}] or username [${newUser.username}] already exist in the database`
      );
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hash = await bcrypt.hash(newUser.password, 10);

    const createdUser = await new User({
      ...newUser,
      password: hash,
    }).save();

    res.status(201).json({
      token: createToken(createdUser._id),
      user: renderFields(createdUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

async function obtainUser(criteria) {
  try {
    return await User.findOne(criteria);
  } catch (error) {
    throw new Error('Error to obtain the user: ' + error.message);
  }
}

router.post('/login', async (req, res) => {
  try {
    let userNotAuthenticated = req.body;

    let userRegistered = await obtainUser({ email: userNotAuthenticated.email });

    if (!userRegistered) {
      console.log(
        `[${userNotAuthenticated.email}] does not exist. You could not be authenticated`
      );
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let correctPass = await bcrypt.compare(
      userNotAuthenticated.password,
      userRegistered.password
    );

    if (correctPass) {
      let token = createToken(userRegistered._id);

      console.log(
        `${userNotAuthenticated.email} successfully authenticated.`
      );

      const user = renderFields(userRegistered);

      res.status(200).json({ token, user });
    } else {
      console.log(`${userNotAuthenticated.email} incorrect password`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function createToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

function renderFields(user) {
  return {
    _id: user._id || user.id,  
    email: user.email,
    username: user.username,
    firstImage: user.firstImage,
  };
}





module.exports = router;



