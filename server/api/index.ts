import express, { Application } from 'express';
import { constants } from '../config/constants';

const app: Application = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.listen(constants.PORT, () => console.log(`Server ready on port ${constants.PORT}.`));

module.exports = app;