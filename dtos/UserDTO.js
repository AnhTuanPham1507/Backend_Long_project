const { validateString, validateEmail, validateEnum, validateObjectId } = require("../validation/validation")
const USERROLEENUM = require("../enums/UserRole")

function createUserDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateString(input.username))
        errMessages.push("trường 'username' chưa hợp lệ")
    if (validateString(input.password))
        errMessages.push("trường 'password' chưa hợp lệ")
    if (validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (validateString(input.email))
        errMessages.push("trường 'email' chưa hợp lệ")
    if (validateString(input.phone))
        errMessages.push("trường 'phone' chưa hợp lệ")
    if (validateString(input.address)) {
        input.address = ""
    }
    if (validateEnum(USERROLEENUM, input.role))
        errMessages.push("trường 'role' chưa hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }

    return {
        data: {
            username: input.username,
            password: input.password,
            name: input.name,
            email: input.email,
            phone: input.phone,
            role: input.role,
            address: input.address
        }
    }
}

function updateUserDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (input.name !== undefined && validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (input.email !== undefined && validateString(input.email))
        errMessages.push("trường 'email' chưa hợp lệ")
    if (input.phone !== undefined && validateString(input.phone))
        errMessages.push("trường 'phone' chưa hợp lệ")
    if (input.address !== undefined && validateString(input.address)) {
        errMessages.push("trường 'address' chưa hợp lệ")
    }
    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }

    const data = { name: input.name, email: input.email, phone: input.phone, address: input.address }
    return { data }
}

function loginUserDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateString(input.username))
        errMessages.push("trường 'username' chưa hợp lệ")
    if (validateString(input.password))
        errMessages.push("trường 'password' chưa hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    return {
        data: {
            username: input.username,
            password: input.password,
        }
    }
}

function forgotPasswordUserDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateEmail(input.email))
        errMessages.push("trường 'email' chưa hợp lệ")
    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    return {
        data: {
            email: input.email
        }
    }
}

function updateNewPasswordDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateString(input.password))
        errMessages.push("trường 'password' chưa hợp lệ")
    if (validateObjectId(input.token))
        errMessages.push("trường 'token' chưa hợp lệ")
    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    return {
        data: {
            password: input.password,
            token: input.token
        }
    }
}

function deleteUserDto(id) {
    const errMessages = []

    if (validateObjectId(id))
        errMessages.push("Id không hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    return { data: { id } }

}
module.exports = { createUserDto, loginUserDto, updateUserDto, deleteUserDto, forgotPasswordUserDto,updateNewPasswordDto }
