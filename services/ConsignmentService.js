const { CustomError } = require('../errors/CustomError')
const consignmentRepo = require('../repositories/ConsignmentRepo')
const CONSIGNMENTSTATUS = require('../enums/ConsignmentStatus')

function getAll() {
    return consignmentRepo.getAll()
}

function create(consignmentDTO, session) {

    return consignmentRepo.create(consignmentDTO, session)
}

function createMany(consignments, session) {

    return consignmentRepo.createMany(consignments, session)
}

async function updateConsignment(updatingConsignmentDto, session) {
    try {
        const { r_productDetail, quantity } = updatingConsignmentDto
        let myQuantity = quantity
        const foundConsignments = await consignmentRepo.findByProductDetailId(r_productDetail, session)
        if (foundConsignments.reduce((total, item) => total + item.quantity, 0) >= myQuantity) {
            // use some to loop until myquantity equal 0
            foundConsignments.some(consignment => {
                if (consignment.quantity <= myQuantity) {
                    consignment.quantity = 0
                    consignment.status = CONSIGNMENTSTATUS['OUT_OF_STOCK']
                    myQuantity -= consignment.quantity
                } else {
                    consignment.quantity -= myQuantity
                    if (consignment.quantity <= 50)
                        consignment.status = CONSIGNMENTSTATUS['COMMING_OUT_OF_STOCK']
                    myQuantity = 0
                }
                consignment.save()
                if (myQuantity == 0)
                    return true
                return false
            })
            return Promise.resolve()
        }
        else {
            return Promise.reject(new CustomError(`số lượng hàng trong kho không đủ`,400))
        }
    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

module.exports = { getAll, create, createMany, updateConsignment }