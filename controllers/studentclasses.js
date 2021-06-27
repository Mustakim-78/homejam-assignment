import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const getClasses = async (req, res) => {
    try {
        let queryData = [req.params.studentID];
        console.log(queryData);
        let data = await new Promise((resolve,reject) => {
            pool.query("select I.id as instructor_id, concat(I.first_name,' ',I.last_name) as instructor_name,I.email, C.id as class_id, C.class_name,C.description, C.class_time, C.created_at from enrollment E join Classes C on E.class_id=C.id join instructor I on C.instructor_id=I.id where E.student_id=$1",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows);
                }
            })
        })
        res.status(200).json(data);   
    } catch (error) {
        res.send(error);
    }
}

export const enrollClass = async (req, res) => {
    let {classID} = req.body;
    let queryData = [classID,req.params.studentID];
    try {
        let data  = await pool.query("select * from enrollment where class_id=$1 and student_id=$2",queryData);
        if(data.rows.length>0) return res.status(400).json({message:'Class Already Enrolled'});

        let returnData = await new Promise((resolve,reject) => {
            pool.query("insert into enrollment values($1, $2) returning *",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows[0]);
                }
            })
        })
        res.status(200).json(returnData);
    } catch (error) {
        res.send(error);
    }
}

export const leaveClass = async (req, res) => {
    let queryData = [req.params.classID,req.params.studentID];
    try {
        let returnData = await new Promise((resolve,reject) => {
            pool.query("delete from enrollment where class_id=$1 and student_id=$2",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rowCount);
                }
            })
        })
        if(returnData)
            return res.status(201).send({"message":"Removed from Class"});
    } catch (error) {
        res.send(error);
    }
}