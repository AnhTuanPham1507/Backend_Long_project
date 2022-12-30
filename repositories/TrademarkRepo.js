const trademark  = require("../models/TrademarkModel")

const create = ({name, img},session)=>{
   return trademark.create([{name, img}],{session})
}

const getAll = () => {
    return trademark.find({active:true})
}

const getById = (id) => {
    return trademark.findById(id)
}

const getAllInActive = () => {
    return trademark.find({active:false})
}

const getByName = (trademarkName) => {
    return trademark.findOne({trademarkName})
}

const deleteOne = (id,session) => {
    return trademark.findOneAndUpdate({ _id: id }, { active: false }, { new: true }).session(session)
}

const updateOne = ({id, name, img },session) =>{
    return trademark.findOneAndUpdate({_id: id},{ name, img, updatedAt: new Date() }, {new:true}).session(session)
}

module.exports = {create , getAll, getByName, getAllInActive, deleteOne, updateOne, getById}
