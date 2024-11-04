require('dotenv').config()
const PORT = process.env.PORT

const express = require('express')
const db = require('./config/database')
const courseRouter = require('./routes/courseRoute')
const lessonRouter = require('./routes/lessonRoute')
const vocabularyRouter = require('./routes/vocabularyRoute')
const app = express()


db.connect()
app.use(express.json());
app.use('/api/courses', courseRouter)
app.use('/api/lesson', lessonRouter)
app.use('/api/vocabulary', vocabularyRouter)



app.listen(PORT, () => console.log(`Example app listening`))