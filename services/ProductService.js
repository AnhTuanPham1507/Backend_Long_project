const productRepo = require('../repositories/ProductRepo')

function getAll(){
    return productRepo.getAll()
}

function create(productDTO, session){
    return productRepo.create(productDTO, session)
}
function getById(id){
    return productRepo.getById(id)
}

function getById(id){
    return productRepo.getById(id)
}

function getByCategoryId(id){
    return productRepo.getByCategoryId(id)
}

module.exports = {getAll,create, getById, getByCategoryId}
function update(updateProductDTO, session) {
    return productRepo.updateOne(updateProductDTO,session)
}

function getByName(name){
    return productRepo.getByName(name)
}
function deleteOne(id,session) {
    return productRepo.deleteOne(id,session)
}


module.exports = {getAll,create,getById,getByName,update,deleteOne}
