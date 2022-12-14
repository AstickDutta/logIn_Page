const teacherModel = require("../models/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  isValidTitle,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidBody,
  isValid,
} = require("../validations/validation");

const registerUser = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidBody(data))
      return res
        .status(400)
        .send({ status: false, message: "All fields are required" });

    const { title, name, email, password } = data;

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is required " });
    }
    if (!isValid(title) || !isValidTitle(title)) {
      return res.status(400).send({
        status: false,
        message: "title should be a valid format-Mr, Mrs, Miss",
      });
    }

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is required " });
    }
    if (!isValidName(name.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "name should be a valid format" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is required " });
    }
    if (!isValidEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid emailId" });
    }

    let validEmail = await teacherModel.findOne({ email: email });
    if (validEmail)
      return res
        .status(400)
        .send({ status: false, message: "This email is already registered" });

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    if (!isValidPassword(password.trim()))
      return res.status(400).send({
        status: false,
        msg: "Password must contain (8-15) characters, atleast One UpperCase , One LowerCase , One Numeric Value and One Special Character.",
      });

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    let savedData = await teacherModel.create(data);
    return res
      .status(201)
      .send({
        status: true,
        message: "successfully registered",
        data: savedData,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



const loginTeacher = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!isValidBody(data))
      return res.status(404).send({
        status: false,
        Msg: "Please provide data in the request body!",
      });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Email is required!" });

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is invalid!" });
    }

    let checkEmail = await teacherModel.findOne({ email: email });
    if (!checkEmail) {
      return res
        .status(401)
        .send({ status: false, message: "Email Is incorrect!" });
    }
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password " });

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!",
      });
    }

    let encryptPwd = checkEmail.password;

    await bcrypt.compare(password, encryptPwd, function (err, result) {
      if (result) {
        let token = jwt.sign({ _id: checkEmail._id.toString() }, "LogIn_003", {
          expiresIn: "72h",
        });

        return res.status(201).send({
          status: true,
          message: "User login successfull",
          data: { teacherId: checkEmail._id, token: token },
        });
      } else {
        return res
          .status(401)
          .send({ status: false, message: "Invalid password!" });
      }
    });
  } catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
};

module.exports = { registerUser, loginTeacher };
