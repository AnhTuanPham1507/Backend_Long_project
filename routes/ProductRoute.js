const { Router } = require('express')
const router = Router({ mergeParams: true })
const productService = require("../services/productService")
const { createProductDto, getProductByIdDto, updateProductDto } = require("../dtos/productDTO")
const { CustomError } = require("../errors/CustomError")


const { default: mongoose } = require('mongoose')
const product = require('../models/ProductModel')

router
    .post("/", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const productDTO = createProductDto({ ...req.body })
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

    .put("/:id", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const productDTO = updateProductDto(req.params.id, req.body)
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
            const products = await productService.getAll()
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
    .delete('/:id',(req,res)=>{
        productService.deleteOne(req.params.id)
        .then(product=>{
            return res.status(200).json(product);
        })
        .catch(err=>{
            res.status(400).json({message:err})
        })
    })

module.exports = { router }