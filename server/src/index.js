const express = require('express');  
const authJWT = require('./libs/auth');
const cors = require('cors');
const passport = require('passport');

const usersRouter = require('./routes/users');

const app = express();



passport.use(authJWT);

require('./database');

    
app.use(express.json());
app.use(cors());  
app.use(passport.initialize());

     
app.use('/users', usersRouter);



app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});    

