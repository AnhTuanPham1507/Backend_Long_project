const { Router } = require('express')
const router = Router({ mergeParams: true })

const { CustomError } = require('../errors/CustomError')
const exportOrderService = require("../services/ExportOrderService")
const { verifyToken } = require("../middlewares/VerifyToken")
const { createExportOrderDto, updateExportOrderDto } = require('../dtos/ExportOrderDTO')

const { default: mongoose } = require('mongoose')

router
    .post("/",verifyToken,  async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const exportOrderDTO = createExportOrderDto(req.body)
            if (exportOrderDTO.hasOwnProperty("errMessage"))
                throw new CustomError(exportOrderDTO.errMessage, 400)
            exportOrderDTO.data['r_user'] = req.user.id
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
    .get("/", async (req,res) => {
        try {
            const exportOrders = await exportOrderService.getAll()
            res.status(200).json(exportOrders)
        } catch (error) {
            return res.status(500).json({message:"Server has something wrong!!"})
        }
    })
    .get("/byUser", verifyToken,async (req, res) => {
        try {
          const foundOrders = await exportOrderService.getByUserId(req.user.id)
          return res.status(200).json(foundOrders);
        } catch (error) {
          return res.status(500).json(error.toString());
        }
      })
    .put("/:id", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const exportOrderDTO = updateExportOrderDto(req.params.id,req.body)
            if (exportOrderDTO.hasOwnProperty("errMessage"))
                throw new CustomError(exportOrderDTO.errMessage, 400)
            const updatedExportOrder = await exportOrderService.update(exportOrderDTO.data, session)
            console.log(updatedExportOrder)
            await session.commitTransaction()
            res.status(200).json(updatedExportOrder)

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json("Server has something wrong!!")
            console.error(error.toString())
        }

    })
module.exports = { router }