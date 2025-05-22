const App = require('./app');

const port = 3001;
const app = new App();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});