const { Router } = require('express')
const router = Router({ mergeParams: true })

const { CustomError } = require('../errors/CustomError')
const importOrderService = require("../services/ImportOrderService")
const { verifyToken } = require("../middlewares/VerifyToken")
const { createImportOrderDto } = require('../dtos/ImportOrderDTO')

const { default: mongoose } = require('mongoose')

router
    .post("/",verifyToken, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const importOrderDTO = createImportOrderDto(req.body)
            if (importOrderDTO.hasOwnProperty("errMessage"))
                throw new CustomError(importOrderDTO.errMessage, 400)
            importOrderDTO.data['r_user'] = req.user.id
            const createdImportOrder = await importOrderService.create(importOrderDTO.data, session)
            await session.commitTransaction()
            res.status(201).json(createdImportOrder)
        } catch (error) {
            console.log(error)
            await session.abortTransaction()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
        }finally{
            session.endSession()
        }

    })
    .get("/", async (req,res) => {
        try {
            const importOrders = await importOrderService.getAll()
            res.status(200).json(importOrders)
        } catch (error) {
            return res.status(500).json({message:"Server has something wrong!!"})
        }
    })

module.exports = { router }