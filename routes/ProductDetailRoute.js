const { Router } = require('express')
const router = Router({ mergeParams: true })
const productDetailService = require("../services/ProductDetailService")
const { createProductDetailDto } = require("../dtos/ProductDetailDTO")
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