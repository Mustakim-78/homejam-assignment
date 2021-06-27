import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const getClasses = async (req, res) => {
    
    let queryData = [req.params.instructorID];
    let data = await new Promise((resolve,reject) => {
        pool.query("select * from classes where instructor_id=$1",queryData,(err,result) => {
            if(err)
                reject(err);
            else{
                resolve(result.rows);
            }
        })
    })
    res.status(200).json(data);
}

export const createClass = async (req, res) => {
    const {className, description, classTime} = req.body;
    try {
        const queryData = [uuidv4(), className, description,classTime,req.params.instructorID];
        let returnData = await new Promise((resolve,reject) => {
            pool.query("insert into classes(id, class_name, description, class_time, instructor_id) values($1, $2, $3, $4, $5) returning *",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows[0]);
                }
            })
        })
        
        res.status(201).send({returnData});
    } catch (error) {
        res.status(400).send(error);
    }
}

export const updateClass = async (req, res) => {
    const {className, description, classTime} = req.body;
    try {
        const queryData = [className, description,classTime,req.params.classID];
        let returnData = await new Promise((resolve,reject) => {
            pool.query("update classes set class_name=$1, description=$2, class_time=$3 where id=$4 returning *",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rows[0]);
                }
            })
        })
        res.status(201).send({returnData});
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteClass = async (req,res) => {
    try {
        console.log("delete");
        const queryData = [req.params.classID];
        let returnData = await new Promise((resolve,reject) => {
            pool.query("delete from classes where id=$1",queryData,(err,result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.rowCount);
                }
            })
        })
        if(returnData)
            return res.status(201).send({"message":"Class Deleted"});
    } catch (error) {
        res.status(400).send(error);
    }
}

export const studentInClass = async (req, res) => {
    
    let queryData = [req.params.classID];
    let data = await new Promise((resolve,reject) => {
        pool.query("select S.id, concat(S.first_name,' ',S.last_name) as student_name, S.email from Student S join enrollment E on S.id=E.student_id where E.class_id=$1",queryData,(err,result) => {
            if(err)
                reject(err);
            else{
                resolve(result.rows);
            }
        })
    })
    res.status(200).json(data);
}

export const enrollStudentInClass = async (req, res) => {
    try {
        let students = req.body.students;
        for(let i=0; i<students.length; i++){
            let ids = await pool.query("select id from Student where email=$1",[students[i]]);
            if(ids.rows.length == 0) //if student doesnot exists
                continue;
            await pool.query("insert into enrollment values ($1,$2)",[req.params.classID,ids.rows[0].id]);
        }
        res.status(200).json({"Message":"Students Added"});
    } catch (error) {
        res.status(400).send(error);
    }
}

export const deleteStudentInClass = async (req, res) => {
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