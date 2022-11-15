const { Router } = require('express')
const router = Router({ mergeParams: true })
const categoryService = require("../services/CategoryService")
const { createCategoryDto } = require("../dtos/CategoryDTO")
const { CustomError } = require("../errors/CustomError")
const {uploadFile} = require("../middlewares/UploadFile")

router
    .post("/", uploadFile, async (req, res) => {
        try {
            let img = ""
            if(req.file !== null && req.file !== undefined)
                img = req.file.filename
            const categoryDTO = createCategoryDto({...req.body, img})
            if (categoryDTO.hasOwnProperty("errMessage"))
                throw new CustomError(categoryDTO.errMessage, 400)
            const createdCategory = await categoryService.create({...categoryDTO.data,img})
            res.status(201).json(createdCategory)

        } catch (error) {
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json("Server has something wrong!!")
            console.error(error.toString())
        }

    })
    .get("/", async (req, res) => {
        try {
            const categories = await categoryService.getAll()
            return res.status(200).json(categories)
        } catch (error) {
            res.status(500).json(error)
        }
    })
    .delete('/:id',(req,res)=>{
        categoryService.remove(req.params.id)
        .then(category=>{
            return res.status(200).json(category);
        })
        .catch(err=>{
            res.status(400).json({message:err})
        })
    })

module.exports = { router }