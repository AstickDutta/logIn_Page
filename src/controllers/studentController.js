const studentModel = require("../models/studentModel");
const teacherModel = require("../models/teacherModel");

const {
  isNumber,
  isValidBody,
  isValidWords,
  isValidName,
  isValidId,
  isValid,
} = require("../validations/validation");

let createStudent = async function (req, res) {
  try {
    let data = req.body;
    const decodedToken = req.teacher;

    let { studentName, subject, marks } = data;

    if (!isValidBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Please provide data in request body",
      });
    }

    if (!studentName)
      return res
        .status(400)
        .send({ status: false, message: "studentName is required!" });

    if (!isValidWords(studentName)) {
      return res
        .status(400)
        .send({ status: false, message: "studentName is invalid!" });
    }

    if (!subject)
      return res
        .status(400)
        .send({ status: false, message: "subject is required!" });

    if (!isValidWords(subject)) {
      return res
        .status(400)
        .send({ status: false, msg: "subject is invalid!" });
    }

    if (!marks)
      return res
        .status(400)
        .send({ status: false, message: "marks is required!" });

    if (!isNumber(marks)) {
      return res.status(400).send({ status: false, msg: "marks is invalid!" });
    }

    let dTokenId = decodedToken._id;
    let teacher = await teacherModel.findOne({ _id: dTokenId });

    let teacherId = teacher;

    let createstudent = await studentModel.findOne({
      $and: [{ studentName }, { subject }, { teacherId: teacherId }],
    });

    if (createstudent) {
      let updateStudent = await studentModel.findOneAndUpdate(
        { $and: [{ teacherId: teacherId }, { _id: createstudent._id }] },
        { $inc: { marks: +marks } },
        { new: true }
      );
      return res
        .status(201)
        .send({
          status: true.valueOf,
          message: "Student marks updated succesfully",
          data: updateStudent,
        });

    } else {
      let student = {
        studentName: studentName,
        subject: subject,
        marks: marks,
        teacherId: teacherId,
      };

      let newStudent = await studentModel.create(student);
      return res
        .status(201)
        .send({
          status: true,
          message: "student marks updated succesfully",
          data: newStudent,
        });
    }
  } catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
};


const getStudentsDetails = async function (req, res) {
  try {
    let field = req.query;

    const { studentName, subject, marks } = field;

    const decodedToken = req.teacher;
    let dTokenId = decodedToken._id;

    if (studentName) {
      if (!isValid) {
        return res
          .status(400)
          .send({ status: false, message: "studentName should  be present" });
      }
    }

    if (subject) {
      if (!isValid) {
        return res
          .status(400)
          .send({ status: false, message: "subject should  be present" });
      }
    }

    if (marks) {
      if (!isValid) {
        return res
          .status(400)
          .send({ status: false, message: "marks should  be present" });
      }
    }

    let filter = {
      ...field,
      isDeleted: false,
    };

    const getStudents = await studentModel.find(filter).select({
      studentName: 1,
      subject: 1,
      marks: 1,
    });

    if (getStudents.length == 0)
      return res
        .status(404)
        .send({ status: false, message: "No student is found" });

    return res
      .status(200)
      .send({ status: true, message: "students list", data: getStudents });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateStudentDetails = async function (req, res) {
  try {
    let data = req.body;
    let studentid = req.params.studentId;

    let { studentName, subject, marks } = data;
    const decodedToken = req.teacher;
    let dTokenId = decodedToken._id;

    if (!isValidBody(data))
      return res.status(400).send({
        status: false,
        message: "Please enter data to create review ",
      });

    let checkStudent = await studentModel.findOne({
      _id: studentid,
      isDeleted: true,
    });

    if (checkStudent)
      return res.status(400).send({
        status: false,
        message: "No student available with is studentId !!",
      });

    if (studentName) {
      if (!isValidName(studentName))
        return res
          .status(400)
          .send({ status: false, message: "studentName should be string !!" });
    }
    if (subject) {
      if (!isValidName(subject))
        return res
          .status(400)
          .send({ status: false, message: "subject should be string !!" });
    }
    if (marks) {
      if (!isNumber(marks))
        return res
          .status(400)
          .send({ status: false, message: "marks should be number !!" });
    }

    if (marks == undefined) marks = 0;

    let findteacher = await teacherModel.findOne({ _id: dTokenId }).lean();
    if (!isValidId(studentid))
      return res
        .status(400)
        .send({ status: false, message: "student id is not valid" });

    let updatestudent = await studentModel.findOneAndUpdate(
      { $and: [{ teacherid: findteacher._id }, { _id: studentid }] },
      { $set: { studentName, subject, marks } },
      { new: true }
    );

    if (!updatestudent || updatestudent.isDeleted == true)
      return res.status(400).send({
        status: false,
        message: "student is not able to update or it is already deleted",
      });
    findteacher.studentdetails = updatestudent;

    return res.status(200).send({
      status: true,
      message: "update all the data of student",
      data: findteacher,
    });
  } catch (err) {
    return res.status(400).send({ status: false, message: err.message });
  }
};

const deleteStudent = async function (req, res) {
  try {
    let studentId = req.params.studentId;
    let decodedToken = req.teacher;
    let dTokenId = decodedToken._id;

    if (!isValidId(studentId)) {
      return res
        .status(400)
        .send({ status: false, message: "studentId not valid" });
    }

    let studentData = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (!studentData) {
      return res
        .status(404)
        .send({ status: false, message: "student not exist" });
    }

    await studentModel.updateOne({ _id: studentId }, { isDeleted: true });

    return res
      .status(200)
      .send({ status: true, message: "student Successfully Deleted" });
  } catch (err) {
    return res.status(500).send({ satus: false, err: err.message });
  }
};

module.exports = {
  createStudent,
  updateStudentDetails,
  deleteStudent,
  getStudentsDetails,
};
