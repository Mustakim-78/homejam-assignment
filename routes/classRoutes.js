import express from 'express';
import { getClasses, createClass, updateClass, deleteClass, studentInClass, enrollStudentInClass, deleteStudentInClass } from '../controllers/classes.js';
import auth from '../middleware/auth.js';

const router = express.Router();


// Classes route from creating, retrieving, updating and deleting classes;
//calling middleware auth for verification
router.get('/:instructorID/classes',auth, getClasses);//fetch classes created by specific instructor
router.post('/:instructorID/classes',auth, createClass);
router.patch('/:instructorID/classes/:classID',auth, updateClass);
router.delete('/:instructorID/classes/:classID',auth, deleteClass);

router.get('/:instructorID/classes/:classID/students',auth, studentInClass);
router.post('/:instructorID/classes/:classID/students',auth, enrollStudentInClass); //instructor can add student with email(array of emails);
router.delete('/:instructorID/classes/:classID/students/:studentID',auth, deleteStudentInClass);//instructor removing students
export default router;