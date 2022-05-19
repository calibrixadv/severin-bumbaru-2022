const mongoose = require('mongoose')

const FacultySchema = new mongoose.Schema(
    {
        Name: { type: String, required: true, unique: true },
        Location:{type:String, required:true, unique:true},
        Service:{type:String, required:true, unique:true},
        Contact:{type:String, required:true, unique:true},
        Site:{type:String},
        Lat:{type:Number},
        Long:{type:Number},
        Description:{type:String}

    },
    { collection: 'faculty' }
)

const model = mongoose.model('FacultySchema', FacultySchema)

module.exports = model