const path = require('path');
const express = require('express');
const app = express();
const { IOCContainer } = require('iocjs');

const IOC = new IOCContainer(path.resolve(__dirname, './iocconfig.js'));
const PORT = 3000;

let service;

// Parse request bodies
app.use(express.json());

// Make static files available from top-level assets directions
app.use(express.static(path.resolve(__dirname, '../assets')));

// Serve the index.html file on request to server
app.get('/', (req, res, next) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

// Generate a response based on the currently active service
app.get('/api', ({ query: { input } }, res, next) => {
  try {
    return res.status(200).json({ result: service.serve(input) });
  } catch (e) {
    return next({
      log: 'Failed to use service: ' + e,
      message: 'Server failed to handle request',
      status: 500,
    });
  }
});

// Inject a new service into the routes
app.patch('/api/:service', (req, res, next) => {
  try {
    IOC.inject(req.params.service, (updatedService) => {
      service = updatedService;
      console.log('The current service is: ' + req.params.service);
    });
    return res.sendStatus(200);
  } catch (e) {
    return next({
      log: 'Failed to inject a new service: ' + e,
      message: 'Problem injecting new service into server',
      status: 500,
    });
  }
});

// Return the IOCContainer makes available to the client
app.get('/api/getservices', (req, res, next) => {
  try {
    return res.status(200).json({ result: Object.keys(IOC.dependencies) });
  } catch (e) {
    return next({
      log: 'Failed to get services: ' + e,
      message: 'Server failed to get services',
      status: 500,
    });
  }
});

// Establish global error handling
app.use((err, req, res, next) => {
  // Define error defaults
  const defaultErr = {
    log: 'An error occurred in unknown middleware',
    status: 500,
    message: { err: 'There was a problem in the server' },
  };

  // Update defaults with info from Error
  err = Object.assign({}, defaultErr, err);
  // Log to server console the 'log' message
  console.log(err.log);
  // Send the client a status and message
  return res.status(err.status).json(err.message);
});

// Start up server
app.listen(PORT, () => {
  // Instantiate the HelloWorld service by default
  IOC.inject('HelloWorld', (updatedService) => {
    service = updatedService;
  });
  console.log(`~~~~~~~~\nServer listening on PORT: ${PORT}\n~~~~~~~~`);
});
