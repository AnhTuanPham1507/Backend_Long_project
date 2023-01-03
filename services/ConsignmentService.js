const { CustomError } = require('../errors/CustomError')
const consignmentRepo = require('../repositories/ConsignmentRepo')
const notificationRepo = require('../repositories/NotificationRepo')
const CONSIGNMENTSTATUS = require('../enums/ConsignmentStatus')
const ConsignmentStatus = require('../enums/ConsignmentStatus')
const NOTIFICATIONTYPE = require("../enums/NotificationType");


function createMany(consignments, session) {

    return consignmentRepo.createMany(consignments, session)
}

async function updateConsignment(updatingConsignmentDto, session) {
    try {
        const { r_product,size,  quantity } = updatingConsignmentDto
        let myQuantity = quantity
        const foundConsignments = await consignmentRepo.findByProductAndSize({r_product,size}, session)
        if (foundConsignments.reduce((total, item) => total + item.quantity, 0) >= myQuantity) {
            // use some to loop until myquantity equal 0
            foundConsignments.some(async consignment => {
                if (consignment.quantity <= myQuantity) {
                    consignment.quantity = 0
                    consignment.status = CONSIGNMENTSTATUS['OUT_OF_STOCK']
                    myQuantity -= consignment.quantity
                    await notificationRepo.create({
                        type: NOTIFICATIONTYPE.OUT_OF_STOCK,
                        r_consignment: consignment._id
                      }, session)
                } else {
                    consignment.quantity -= myQuantity
                    if (consignment.quantity <= Number(process.env.NUMBER_COMMING_OUT_OF_STOCK)){
                        consignment.status = CONSIGNMENTSTATUS['COMMING_OUT_OF_STOCK']
                        await notificationRepo.create({
                            type: NOTIFICATIONTYPE.COMMING_OUT_OF_STOCK,
                            r_consignment: consignment._id
                          }, session)
                    }
                    myQuantity = 0
                }
                await consignment.save()
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

async function checkCommingOutOfStock(session) {
    const foundConsignments = await consignmentRepo.getStockConsignment(session)
  
    for(const c of foundConsignments) {
      if (c.quantity <= Number(process.env.NUMBER_COMMING_OUT_OF_STOCK)) {
        c.status = ConsignmentStatus.COMMING_OUT_OF_STOCK
        await c.save()
        await notificationRepo.create({
          type: NOTIFICATIONTYPE.COMMING_OUT_OF_STOCK,
          r_consignment: c._id
        }, session)
      }
    }
  }
module.exports = { createMany, updateConsignment, checkCommingOutOfStock }