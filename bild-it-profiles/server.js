const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true })
    .catch(error => console.log(error));

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB connection established sucessfully.')
});

const exerciseRouter = require('./modules/exercises/exercise.controller');
const userRouter = require('./modules/users/user.controller');
const commentRouter = require('./modules/comments/comment.controller');
const notificationRouter = require('./modules/notifications/notification.controller');

app.use('/v1/api/exercises', exerciseRouter);
app.use('/v1/api/users', userRouter);
app.use('/v1/api/comments', commentRouter);
app.use('/v1/api/notifications', notificationRouter);



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
const notificationSocket = require('./modules/notifications/notification.socket');
notificationSocket.attach(server);

