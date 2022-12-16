const exportOrderDetailRepo = require('../repositories/ExportOrderDetailRepo')
const exportOrderRepo = require('../repositories/ExportOrderRepo')
const paymentRepo = require('../repositories/PaymentRepo')
const consignmentService = require('./ConsignmentService')
const PAYMENTTYPE = require('../enums/PaymentType')
const { CustomError } = require('../errors/CustomError')
const { sendRequestMomo } = require('../helpers/Momo')

async function create(exportOrderDTO, session) {
    try {
        const details = exportOrderDTO.r_exportOrderDetails
        const updatingQuantityConsignmentPromise = []
        details.forEach(detail => {
            updatingQuantityConsignmentPromise.push(
                consignmentService.updateConsignment({r_productDetail: detail.r_productDetail, quantity: detail.quantity},session)
            )
        })

        await Promise.all(updatingQuantityConsignmentPromise)
        const createdExportOrderDetails = await exportOrderDetailRepo.createMany(details,session)
        const createdExportOrder = await exportOrderRepo.create({
            totalBill: exportOrderDTO.totalBill,
            r_user: exportOrderDTO.r_user, 
            address: exportOrderDTO.address,
            name: exportOrderDTO.name, 
            phone: exportOrderDTO.phone, 
            email: exportOrderDTO.email,
            r_exportOrderDetails: createdExportOrderDetails
        },session)
        const createdPayment = await paymentRepo.create({type: exportOrderDTO.paymentType, r_exportOrder: createdExportOrder[0]},session)
        if(exportOrderDTO.paymentType === PAYMENTTYPE.MOMO){
            const data = await sendRequestMomo({exportOrderId: createdExportOrder[0]._id.toString(), paymentId: createdPayment[0]._id.toString(), totalBill: createdExportOrder[0].totalBill})
        
            return Promise.resolve({data, type: exportOrderDTO.paymentType})
        }
        return Promise.resolve({type: exportOrderDTO.paymentType})
    } catch (error) {
        (error)
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

module.exports = { create }