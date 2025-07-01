const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

router.get('/',studentController.getStudent);
router.get('/add',studentController.geteditpage);
router.post('/add',studentController.postdata);
router.get('/edit/:id',studentController.getStudentById);
router.post('/edit',studentController.postEditedData)
router.get('/delete/:id',studentController.deleteStudents)



module.exports = router;