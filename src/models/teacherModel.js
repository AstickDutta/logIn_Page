const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
        trim: true
    },
     name: {
            type: String,
            required: true,
            trim : true
        },
  
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase:true
        },
        password: {
            type: String,
            required: true,
            trim: true,
          },
}, { timestamps: true })



module.exports = mongoose.model('Teacher', teacherSchema)