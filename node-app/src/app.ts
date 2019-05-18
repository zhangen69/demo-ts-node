
import express from 'express';

// import middlewares
import startup from './middlewares/startup';

// initialize app
const app = express();
const port = process.env.PORT || 3000;

app.use(startup); // apply startup configurations
app.listen(port);
 
