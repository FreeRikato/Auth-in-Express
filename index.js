const express = require('express');
const app = express();
const { adminRouter } = require('./routes/admin')
const { userRouter } = require('./routes/user')

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Bitch');
});

app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})