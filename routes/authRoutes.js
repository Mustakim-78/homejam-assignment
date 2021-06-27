import express from 'express';
import { instructorRegister, instructorLogin } from '../controllers/instructorAuth.js';
import { studentRegister, studentLogin } from '../controllers/studentAuth.js';

const router = express.Router();


// Assuming different registraton & login for instructor and student
router.post('/instructor/register',instructorRegister);
router.post('/instructor/login',instructorLogin);

router.post('/student/register',studentRegister);
router.post('/student/login',studentLogin);

export default router;