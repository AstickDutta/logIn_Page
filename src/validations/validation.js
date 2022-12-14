const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const isValid = function (value) {
  if (typeof value == undefined || value == null || value.length == 0)
    return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidBody = function (data) {
  return Object.keys(data).length > 0;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const isValidPassword = function (password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
    password
  );
};

const isValidWords = function (title) {
  return /^[A-Za-z ,.'-]{1,45}/i.test(title);
};

const isValidName = function (name) {
  if (/^[a-z ,.'-]+$/i.test(name)) return true;
  return false;
};

const isValidNumber = function (number) {
  if (/^[0]?[6789]\d{9}$/.test(number)) return true;
  return false;
};
const isNumber = function (number) {
  if (/^[0-9]/.test(number)) return true;
  return false;
};

const isValidId = function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidISBN = (ISBN) => {
  return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN);
};

const isValidReleasedAt = (releasedAt) => {
  return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt);
};

const isValidPincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

const isValidEmail = function (mail) {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
};

const isValidRating = function (rating) {
  if (!/^\s*([1-5]){1}\s*$/.test(rating)) return false;
  return true;
};

module.exports = {
  isValid,
  isValidBody,
  isValidTitle,
  isValidWords,
  isValidPassword,
  isValidName,
  isValidNumber,
  isValidId,
  isValidISBN,
  isValidReleasedAt,
  isValidPincode,
  isValidEmail,
  isValidRating,
  isNumber
};