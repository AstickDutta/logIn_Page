const jwt = require("jsonwebtoken");
const teacherModel = require("../models/teacherModel");


const authenticate = async (req, res, next) => {
  try {
    
    let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];

    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });

    jwt.verify(token, "LogIn_003", (err, decoded) => {
      if (err) {
        let message =
          err.message === "jwt expired"
            ? "token is expired"
            : "token is invalid";

        return res.status(401).send({ status: false, message: message });
      }

      req.teacher = decoded;

      next();
    });
    
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const authorise = async (req, res, next) => {
  try {
    const token = req.headers["x-api-key"];

    const decodedToken = jwt.verify(token, "LogIn_003");
    if (!decodedToken)
      return res.status(403).send({ status: false, msg: "Provide token" });

    let newtoken = decodedToken["_id"];

    const teacher = await teacherModel.findById(newtoken);

    if (!teacher)
      return res
        .status(404)
        .send({ status: false, msg: "teacher Id is wrong" });

    if (teacher._id != decodedToken._id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized person" });

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { authenticate, authorise };
