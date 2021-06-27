import express from 'express';
import { getClasses, enrollClass, leaveClass } from '../controllers/studentclasses.js';
import auth from '../middleware/studentAuth.js';

const router = express.Router();



//calling middleware auth for verification
router.get('/:studentID/classes',auth, getClasses);//fetch classes for students
router.post('/:studentID/classes',auth, enrollClass);
router.delete('/:studentID/classes/:classID',auth, leaveClass);

export default router;