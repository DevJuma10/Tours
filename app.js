const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

//READ DATA FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//API DESIGN

//GET REQUEST
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

//POST REQUEST

const createTour = (req, res) => {
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
};

//GET TOUR
const getTour = (req, res) => {
  //string to int conversion of id params
  const id = req.params.id * 1;

  //Find tour with matching id
  const tour = tours.filter((el) => el.id === id);
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
};

//PATCH REQUEST
const updateTour = (req, res) => {
  //check for item to be updated
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<  UPDATED TOUR GOES HERE ...>',
    },
  });
};

//DELETE REQUEST
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/api/v1/tours/:id', getTour);

// app.patch('/api/v1/tours/:id', updateTour);
// app.post('/api/v1/tours', createTour);

/**
 * ROUTING
 */
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

//START UP SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
