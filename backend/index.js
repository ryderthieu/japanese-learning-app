require('dotenv').config()
const cors = require('cors');
const PORT = process.env.PORT

const express = require('express')
const db = require('./config/database')
const courseRouter = require('./routes/courseRoute')
const lessonRouter = require('./routes/lessonRoute')
const vocabularyRouter = require('./routes/vocabularyRoute')
const userRouter = require('./routes/userRoute')
const app = express()


db.connect()
app.use(express.json());
app.use(cors());

app.use('/api/courses', courseRouter)
app.use('/api/lesson', lessonRouter)
app.use('/api/vocabulary', vocabularyRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {res.send('Hello')})
app.listen(PORT, () => console.log(`Example app listening ${PORT}`))