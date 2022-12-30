const { Router } = require('express')
const router = Router({ mergeParams: true })

const nodemailer = require("nodemailer")
const { CustomError } = require('../errors/CustomError')
const { createUserDto, loginUserDto, updateUserDto, deleteUserDto,forgotPasswordUserDto, updateNewPasswordDto } = require('../dtos/UserDTO')
const userService = require("../services/UserService")
const forgotPasswordService = require("../services/ForgotPasswordService")
const { verifyToken } = require("../middlewares/VerifyToken")

const { default: mongoose } = require('mongoose')

router
    .post("/register", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const userDTO = createUserDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const signToken = await userService.register(userDTO.data, session)
            await session.commitTransaction()
            return res.status(201).json(signToken)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: error.toString() })
        }

    })
    .post("/login", async (req, res) => {
        try {
            const userDTO = loginUserDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const signedToken = await userService.login(userDTO.data)
            return res.status(201).json(signedToken)
        } catch (error) {
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
        }

    })
    .post("/forgot", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const userDTO = forgotPasswordUserDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const foundCustomer = await userService.getByEmail(userDTO.data.email)
            if (!foundCustomer)
                throw new CustomError("tài khoản với email này không tồn tại", 400)

            const createdForgotPassword = await forgotPasswordService.create({r_user: foundCustomer},session)
            await session.commitTransaction()
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: process.env.MY_EMAIL, // generated ethereal user
                pass: process.env.MY_EMAIL_PASSWORD
              },
            });
            // send mail with defined transport object
            await transporter.sendMail({
              from: '"Lão tôn 👻" <phamanhtuan9a531@gmail.com>', // sender address
              to: userDTO.data.email, // list of receivers
              subject: "Lấy lại mật khẩu", // Subject line
              html: `<h1>nhấn vào đường dẫn sau để tạo lại mật khẩu mới <a href="${process.env.UPDATE_NEW_PASSWORD_URL}/${createdForgotPassword[0]._id}">click here</a>`, // html body
            });
            return res.status(201).json({message: "Vui long kiểm tra mail để thực hiện lấy lại mật khẩu"})
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
        }
    })
    .post("/updateNewPassword", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const userDTO = updateNewPasswordDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const updatedUser = await userService.updateNewPassword({...userDTO.data},session)
            await session.commitTransaction()
            return res.status(201).json({message: "cập nhật mật khẩu thành công"})
        } catch (error) {
            console.log(error)
            await session.abortTransaction()
            session.endSession()
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
        }

    })
    .put("/", verifyToken, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const userDTO = updateUserDto(req.body)
            console.log(userDTO)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const updatedUser = await userService.update({ ...userDTO.data, id: req.user.id }, session)
            await session.commitTransaction()
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
        }
    })

    .get("/", verifyToken, (req, res) => {
        try {
            const foundUser = userService.getById(req.user.id)
            return res.status(200).json(foundUser)
        } catch (error) {
            res.status(500).json({ message: "Server has something wrong!!" })
        }
    })

    .delete("/:id", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const userDTO = deleteUserDto(req.params.id)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            await userService.deleteOne(userDTO.data.id, session)
            await session.commitTransaction()
            res.status(201).json({ message: "xoa thanh cong" })
        } catch (error) {
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
            console.error(error.toString())
        }
    })






module.exports = { router }