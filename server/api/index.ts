import express, { Application } from 'express';

const app: Application = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.listen(3333, () => console.log('Server ready on port 3333.'));

module.exports = app;