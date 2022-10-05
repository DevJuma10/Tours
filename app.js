const fs = require('fs');
const express = require('express');
const app = express();

//ROUTING
// app.get('/', (req, res) => {
//   // res.status(200).send('Hello from the server side');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'NaTours' });
// });

// //TESTING POST
// app.post('/', (req, res) => {
//   res.status(200).send('You Can now post to this URL');
// });

//READ DATA FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//API DESIGN

//GET REQUEST
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//START UP SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
