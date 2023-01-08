const jwt = require('jsonwebtoken')

function signToken(user) {
    console.log(user)
    return jwt.sign(
        { id: user._id, name: user.name, role: { id: user.r_role?._id, title: user.r_role?.title }, permissions: user.r_permissions?.map(p => p.type) },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.EXPRIRE_IN_TOKEN,
        }
    );
}

module.exports = { signToken }