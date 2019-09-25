const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true }
}, {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        timestamps: true,
    });

UserSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'user'
});


const User = mongoose.model('User', UserSchema);

module.exports = User;