const express = require('express');
const path = require('path');
const cors = require('cors');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
console.log('process.env.MONGODB',process.env.MONGODB);

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  replicaSet: 'rs1',
  poolSize: 10,
};

mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/config', options);
const app = express();

app.use(cors());

app.get('/hello', (req, res) => {
  return res.send('world');
})
app.use('/config/',require('./routes/config.admin'));

let server = app.listen(4200, () => {
  console.log('server is running on port', server.address().port);
});