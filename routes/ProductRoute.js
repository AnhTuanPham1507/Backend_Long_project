const { Router } = require('express')
const router = Router({ mergeParams: true })
const productService = require("../services/productService")
const { createProductDto, getProductByIdDto, updateProductDto ,deleteProductDto, productFilterDto } = require("../dtos/productDTO")
const { CustomError } = require("../errors/CustomError")


const { default: mongoose } = require('mongoose')
const product = require('../models/ProductModel')
const { uploadFiles } = require('../middlewares/UploadFile')
const getPaginationOptions = require('../helpers/Pagination')

router
    .post("/", uploadFiles, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const productDTO = createProductDto({ ...req.body, imgs: req.files ? req.files.map(file => file.filename): [] })
            if (productDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDTO.errMessage, 400)
            const createdproduct = await productService.create({ ...productDTO.data }, session)

            await session.commitTransaction()
            console.log(createdproduct)
            res.status(201).json(createdproduct)

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

    .put("/:id", uploadFiles, async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const productDTO = updateProductDto(req.params.id, { ...req.body, imgs: req.files.map(file => file.filename)})
            if (productDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDTO.errMessage, 400)
            const updatedProduct = await productService.update({...productDTO.data}, session)
            await session.commitTransaction()
            res.status(201).json(updatedProduct)
        } catch (error) {
            console.log(error)
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
        }
    })

    .get("/", async (req, res) => {
        try {
            const paginationOptions = getPaginationOptions(req)
            const productFilterDTO = productFilterDto(req.query)
            const products = await productService.getAll(productFilterDTO,paginationOptions)
            return res.status(200).json(products)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server has something wrong!!" })
        }
    })

    .get("/admin", async (req, res) => {
        try {
            const productFilterDTO = productFilterDto(req.query)
            const products = await productService.getAllAdminSide(productFilterDTO)
            return res.status(200).json(products)
        } catch (error) {
            res.status(500).json({ message: "Server has something wrong!!" })
        }
    })

    .get("/:id", async (req, res) => {
        try {
            const productDTO = getProductByIdDto(req.params.id)
            if (productDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDTO.errMessage, 400)
            const foundProduct = await productService.getById(productDTO.data.id)
            return res.status(200).json(foundProduct[0])
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server has something wrong!!" })

        }
    })
    .get("/byCategory/:id", async (req,res) => {
        try {
            const productDTO = getProductByIdDto(req.params.id)
            if (productDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDTO.errMessage, 400)
            const foundProduct = await productService.getByCategoryId(productDTO.data.id)
            return res.status(200).json(foundProduct)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server has something wrong!!" })

        }
    })
    .delete("/:id",async (req,res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const productDTO = deleteProductDto(req.params.id)
            if (productDTO.hasOwnProperty("errMessage"))
                throw new CustomError(productDTO.errMessage, 400)
            await productService.deleteOne(productDTO.data.id, session)
            await session.commitTransaction()
            res.status(201).json({message: "xoa thanh cong"})
        } catch (error) {
            await session.abortTransaction()
            session.endSession()

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({message:"Server has something wrong!!"})
            console.error(error.toString())
        }
    })

module.exports = { router }