import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const studentRegister = async (req,res) => {
    const {firstName, lastName, phone, email, password} = req.body;
    try {
        const data  = await pool.query("select * from student where email=$1",[email]);
        if(data.rows.length>0) return res.status(400).json({message:'User already exists'});
        
        //hashing password
        const hashedPassword = await bcrypt.hash(password, 12);
        const queryData = [uuidv4(), firstName, lastName, phone, email, hashedPassword];
        let returnData = await new Promise((resolve,reject) => {
            pool.query("insert into student values($1, $2, $3, $4, $5, $6) returning *",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows[0]);
                }
            })
        })
        
        //generating auth token
        const token = jwt.sign({email:returnData.email, id: returnData.id}, 'test');
        res.status(201).send({returnData, token:token});
    } catch (error) {
        res.status(400).send(error);
    }
}

export const studentLogin = async (req,res) => {
    const {email, password} = req.body;
    try {
        let queryData = [email];
        let data = await new Promise((resolve,reject) => {
            pool.query("select * from student where email=$1",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows[0]);
                }
            })
        })
        if(!data) return res.status(400).json({message:'User not found'});

        const isPasswordCorrect = await bcrypt.compare(password, data.password);

        if(!isPasswordCorrect) return res.status(400).json({message:'Password Incorrect'});
        
        const token = jwt.sign({email:data.email, id: data.id}, 'test');

        res.status(201).json({result:data, token:token});
    } catch (error) {
        res.status(400).send(error);
    }
}