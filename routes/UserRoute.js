const { Router } = require('express')
const router = Router({ mergeParams: true })

const bcrypt = require("bcrypt")
const { CustomError } = require('../errors/CustomError')
const { createUserDto, loginUserDto } = require('../dtos/UserDTO')
const userService = require("../services/UserService")
const { signToken } = require('../helpers/signToken')
const user = require('../models/UserModel')

router
    .post("/register", async (req, res) => {
        try {
            const userDTO = createUserDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)
            const hashPassword = await bcrypt.hashSync(userDTO.data.password, 10)
            userDTO.data.password = hashPassword
            const createduser = await userService.create(userDTO.data)
            res.status(201).json(createduser)
        } catch (error) {
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json("Server has something wrong!!")
            console.error(error.toString())
        }

    })
    .post("/login", async (req, res) => {
        try {
            const userDTO = loginUserDto(req.body)
            if (userDTO.hasOwnProperty("errMessage"))
                throw new CustomError(userDTO.errMessage, 400)

            const foundUser = await userService.getByUsername(userDTO.data.username)
            if (!foundUser)
                throw new CustomError("user không tồn tại", 400)
            const isSamePassword = await bcrypt.compareSync(userDTO.data.password,foundUser.password)
            if(!isSamePassword)
                throw new CustomError("mật khẩu không trùng khớp", 400)
            const signedToken = signToken(foundUser)
            res.status(201).json({signedToken})
        } catch (error) {
            console.log(error)
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json("Server has something wrong!!")
            console.error(error.toString())
        }
    })
    .get("/", async (req, res) => {
        try {
            const users = await userService.getAll()
            return res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    })
    .delete('/:id',(req,res)=>{
        userService.deleteOne(req.params.id)
        .then(user=>{
            return res.status(200).json(user);
        })
        .catch(err=>{
            res.status(400).json({message:err})
        })
    })

module.exports = { router }