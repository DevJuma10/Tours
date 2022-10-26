const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

//  CONNECT TO LOCAL MONGODB (HOSTED LOCALLY)
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('DB Connection succesful');
//   });

// CONNECT TO MONGODB (HOSTED DB VERSION)
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection succesful');
  });

//  CREATE DOCUMENT
// const testTour = new Tour({
//   name: 'The Last Village Lodge',
//   rating: 3.7,
//   price: 350,
//   premium: false,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR: ', err);
//   });

//START UP SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
