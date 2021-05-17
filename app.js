const fs = require('fs');
const express = require('express');

const app = express();

//Used to use middlewares in the requests
app.use(express.json());

const tours =  JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});


// :x is used to add a necessary parameter to the url
// If you want this parameter to be optional then use :x?
// Only last parameter can be optional
app.get('/api/v1/tours/:id', (req, res) => {
  
  //Just a simple way in JS to convert a numeric string to a number
  const id = req.params.id*1;

  if(id > tours.length - 1){
    return res.status(404).json({
      status:'fail',
      message:'Invalid ID'
    })
  }
  const tour  = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});


app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id*1;

  if(id > tours.length - 1){
    return res.status(404).json({
      status:'fail',
      message:'Invalid ID'
    })
  }

  res.status(200).json({
    status:'success',
    tour:'<Updated tour here ...>'
  })
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours.length;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});