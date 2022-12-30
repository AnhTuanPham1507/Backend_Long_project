const importOrderDetailRepo = require('../repositories/ImportOrderDetailRepo')

function getAll(session){
    return importOrderDetailRepo.getAll(session)
}

function create(importOrderDetailDTO, session){
    return importOrderDetailRepo.create(importOrderDetailDTO, session)
}

function createMany(importOrderDetails, session){
    return importOrderDetailRepo.createMany(importOrderDetails, session)
}
module.exports = {getAll,create,createMany}