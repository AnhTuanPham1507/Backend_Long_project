const { Router } = require('express')
const router = Router({ mergeParams: true })

const { CustomError } = require('../errors/CustomError')
const exportOrderService = require("../services/ExportOrderService")
const { verifyToken } = require("../middlewares/VerifyToken")
const { createExportOrderDto } = require('../dtos/ExportOrderDTO')

const { default: mongoose } = require('mongoose')

router
    .post("/", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const exportOrderDTO = createExportOrderDto(req.body)
            if (exportOrderDTO.hasOwnProperty("errMessage"))
                throw new CustomError(exportOrderDTO.errMessage, 400)
            exportOrderDTO.data['r_user'] = "63a08b17e1f2ffd6da41be96"
            const result = await exportOrderService.create(exportOrderDTO.data, session)
            if(result)
                await session.commitTransaction()
            return res.status(201).json(result)
        } catch (error) {
            console.log(error)
            await session.abortTransaction()
            
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
        } finally {
            session.endSession()
        }

    })

module.exports = { router }