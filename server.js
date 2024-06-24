import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json("application/json"));

app.use('/api', router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});