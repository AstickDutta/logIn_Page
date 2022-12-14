const express = require("express")
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const studentController = require('../controllers/studentController');
const mid = require("../middleware/auth")

router.get("/test-me", (req, res) => {
  res.send("My first ever api!");
});

router.post("/register", teacherController.registerUser);
router.post("/logIn", teacherController.loginTeacher);
router.post("/createStudent", mid.authenticate,mid.authorise, studentController.createStudent);
router.get("/getStudent",mid.authenticate,mid.authorise,studentController.getStudentsDetails);
router.put("/updateStudent/:studentId",mid.authenticate,mid.authorise,studentController.updateStudentDetails);
router.delete("/deleteStudent/:studentId",mid.authenticate,mid.authorise,studentController.deleteStudent);


module.exports = router;