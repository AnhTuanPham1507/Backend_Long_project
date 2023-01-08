const { CustomError } = require('../errors/CustomError')
const userRepo = require('../repositories/UserRepo')
const forgotPasswordRepo = require("../repositories/ForgotPasswordRepo")
const bcrypt = require("bcrypt")
const { signToken } = require('../helpers/signToken')
const FORGOTPASSWORDSTATUS = require("../enums/ForgotPasswordStatus")

async function register(userDTO, session){
    try {
        const hashPassword = await bcrypt.hashSync(userDTO.password, 10)
        const createdUser =  await userRepo.create({...userDTO, password: hashPassword}, session)
        const signedToken = signToken(createdUser)
        return Promise.resolve(signedToken)
    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

async function login(userDTO){
    try {
        const foundUser = await userRepo.getByUsername(userDTO.username)
        if (!foundUser)
            throw new CustomError("user không tồn tại", 400)
        const isSamePassword = await bcrypt.compareSync(userDTO.password, foundUser.password)
        if (!isSamePassword)
            throw new CustomError("mật khẩu không trùng khớp", 400)
        const signedToken = signToken(foundUser)
        return Promise.resolve(signedToken)
    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

async function update(userDTO, session){
    try {
        const updatedUser = await userRepo.updateOne(userDTO, session)
        return Promise.resolve(updatedUser)
    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

async function updateNewPassword(userDTO, session){
    try {
        const updateForgotPassword = await forgotPasswordRepo.updateStatus({id: userDTO.token, status: FORGOTPASSWORDSTATUS.VERIFIED}, session)
        const hashPassword = await bcrypt.hashSync(userDTO.password, 10)
        await userRepo.updatePassword({id: updateForgotPassword.r_user, password: hashPassword},session)
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

function deleteOne(id,session) {
    return userRepo.deleteOne(id,session)
}

function getByEmail(email) {
    return userRepo.getByEmail(email)
}

function getById(id) {
    return userRepo.getById(id);
  }

module.exports = {getById, getByEmail, register,login ,update, updateNewPassword, deleteOne}