const express = require('express');
const mongoose = require('mongoose');
//const session = require('express-session')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const shoppingListRoutes = require('./routes/shoppingListsRoutes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/shoppinglistsdb', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(error => console.error('Could not connect to MongoDB... ', error));

app.use(cors())

app.use(express.json());
/**
    app.use(session({
    secret: 'a/#$sd#0$',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      sameSite: 'strict',
    },
  }));
*/

  app.use((req, res, next) => {
    const token = req.headers.authorization;
  
    if (token) {
      try {
        const decoded = jwt.verify(token, 'tajnyKlicProPodpisJWT');
        req.user = decoded;
      } catch (error) {
        console.error(error);
      }
    }
  
    next();
  });
  

  
app.use('/api', authRoutes);
app.use('/api/', shoppingListRoutes);
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
