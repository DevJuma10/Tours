const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());
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

//POST REQUEST
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.get('/api/v1/tours/:id', (req, res) => {
  //string to int conversion of id params
  const id = req.params.id * 1;

  //Find tour with matching id
  const tour = tours.filter((el) => el.id === id);
  console.log(!tour);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'sucesss',
    data: {
      tour,
    },
  });
});
//START UP SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
