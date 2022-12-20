const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key :process.env.CLOUNDINARY_APIKEY,
    api_secret: process.env.CLOUNDINARY_APISECRET,
})
const multer = require('multer')
const path = require('path')

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'img',
        format : async (req,file) =>  path.extname(file.originalname).toLowerCase().substring(1),
        public_id : (req,file) => file.fieldname + '-' + Date.now(),
        resource_type: 'auto'
    }
})

const fileFilter = (file,cb) =>{
    const fileTypes =  /jpeg|jpg|png/

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = fileTypes.test(file.mimetype)

    if(extname && mimetype)
        return cb(null,true)
    else
        cb(`Error: Image only `)
}

const upload = multer({
    storage:storage,
    limits:{fileSize:10000000},
    fileFilter: (req,file,cb)=>{
        fileFilter(file,cb)
    }
}).single('img')

const uploadMul = multer({
    storage:storage,
    limits:{fileSize:10000000},
    fileFilter: (req,file,cb)=>{
        fileFilter(file,cb)
    }
}).array('imgs')

const uploadFile = (req,res,next)=>{
    upload(req,res , (err)=>{
        if(err instanceof multer.MulterError){
            res.status(500).json({message:err})
        }
        else if(err){
            res.status(400).json({message:err})
        }
        else{
            next()
        }
    })
}

const uploadFiles = (req,res,next)=>{
    uploadMul(req,res , (err)=>{
        if(err instanceof multer.MulterError){
            res.status(500).json({message:err})
        }
        else if(err){
            res.status(400).json({message:err})
        }
        else{
            next()
        }
    })
}

module.exports = {uploadFile, uploadFiles}