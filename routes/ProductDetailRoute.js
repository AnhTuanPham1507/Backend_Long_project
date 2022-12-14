const { Router } = require('express')
const router = Router({ mergeParams: true })
const productDetailService = require("../services/ProductDetailService")
const { createProductDetailDto ,updateProductDetailDto } = require("../dtos/ProductDetailDTO")
const { CustomError } = require("../errors/CustomError")
const {uploadFile} = require("../middlewares/UploadFile")

const { default: mongoose } = require('mongoose')

router
    .post("/", uploadFile, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            let img = ""
            if(req.file !== null && req.file !== undefined)
                img = req.file.filename
            const productDetailDTO = createProductDetailDto({...req.body,img})
            if (productDetailDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDetailDTO.errMessage, 400)
            const createdproductDetail = await productDetailService.create({...productDetailDTO.data}, session)

            await session.commitTransaction()
            res.status(201).json(createdproductDetail)

        } catch (error) {
            (error)
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
        }

    })
    .put("/:id", uploadFile, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            let img = ""
            if(req.file !== null && req.file !== undefined)
                img = req.file.filename
            const productDetailDTO = updateProductDetailDto({...req.body,img, id: req.params.id})
            if (productDetailDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDetailDTO.errMessage, 400)
            const updatedproductDetail = await productDetailService.update({...productDetailDTO.data}, session)

            await session.commitTransaction()
            res.status(201).json(updatedproductDetail)

        } catch (error) {
            (error)
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
        }

    })

module.exports = { router }