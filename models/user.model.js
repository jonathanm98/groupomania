const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        isAdmin: {
            type: Boolean,
            default: false
        },
        userTag: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 55,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 55,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
        },
        pictureUrl: {
            type: String,
            default: "./images/user/default.webp"
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("validate", function (next) {
    const {firstName, lastName} = this;
    let tagName = firstName + lastName;
    const findUserTag = async () => {
        const user = await UserModel.findOne({userTag: tagName});
        if (user) {
            tagName += Math.floor(Math.random() * 10);
            findUserTag();
        } else {
            this.userTag = tagName;
            next();
        }
    }
    findUserTag();
});

// play function before save into display: 'block',
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;