import express from 'express';
import  env from 'dotenv';
import bodyparser from 'body-parser';
import cors from 'cors';
import pool from './db.js';
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
const app = express();

app.use(bodyparser.json({limit : "30mb", extended : true}));
app.use(bodyparser.urlencoded({limit : "30mb", extended : true}));
app.use(cors());

const PORT = 5000;


app.get('/',(req,res) => {
    res.send("Welcome to Homejam"); // Assuming this endpoint as HomePage
});

app.use('/auth',authRoutes);
app.use('/instructor', classRoutes);//class CRUD operation by instructor
app.use('/student', studentRoutes);//Student route for viewing their enrolled classes

app.listen(PORT, () => console.log(`server listening on ${PORT}`));