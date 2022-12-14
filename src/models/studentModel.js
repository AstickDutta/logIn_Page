const mongoose = require("mongoose")
let ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({

    teacherId: {
        type: ObjectId,
        required: true,
        ref: "teacherModel",
         trim : true
    },
   
    studentName:{
            type: String,
            required: true,
            trim : true
        },


        subject: {
            type: String,
            required: true,
            trim: true,
          },

          marks: {
            type: Number,
            required: true,
            trim: true,
           
          },

          isDeleted : {
            type : Boolean,
            default : false,
            trim : true

          }

}, { timestamps: true })



module.exports = mongoose.model('Student', studentSchema)