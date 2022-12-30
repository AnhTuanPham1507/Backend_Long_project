const exportOrderDetailRepo = require('../repositories/ExportOrderDetailRepo')
const exportOrderRepo = require('../repositories/ExportOrderRepo')
const paymentRepo = require('../repositories/PaymentRepo')
const consignmentService = require('./ConsignmentService')
const PAYMENTTYPE = require('../enums/PaymentType')
const ORDERSTATUS = require('../enums/ExportOrderStatus.js')
const { CustomError } = require('../errors/CustomError')
const { sendRequestMomo } = require('../helpers/Momo')
const updateExportOrderDto = require('../dtos/ExportOrderDTO')

function getAll() {
    return exportOrderRepo.getAll()
}

async function create(exportOrderDTO, session) {
    try {
        const details = exportOrderDTO.r_exportOrderDetails
        const updatingQuantityConsignmentPromise = []
        details.forEach(detail => {
            updatingQuantityConsignmentPromise.push(
                consignmentService.updateConsignment({r_product: detail.r_product,size: detail.size,  quantity: detail.quantity},session)
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
            const payUrl = await sendRequestMomo({exportOrderId: createdExportOrder[0]._id.toString(), paymentId: createdPayment[0]._id.toString(), totalBill: createdExportOrder[0].totalBill})
        
            return Promise.resolve({payUrl, type: exportOrderDTO.paymentType})
        }
        return Promise.resolve({payUrl:"/order", type: exportOrderDTO.paymentType})
    } catch (error) {
        (error)
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

async function update(exportOrderDTO, session) {
    try{
        const foundOrder = await exportOrderRepo.getById(exportOrderDTO.id, session)
        const tempFoundOrder = foundOrder[0]
        let updatedOrder = null
        if ([ORDERSTATUS.NEW, ORDERSTATUS.SHIPPING].includes(tempFoundOrder.status) && updateExportOrderDto.status === ORDERSTATUS.FALIED) {
        updatedOrder = await exportOrderRepo.updateStatus(exportOrderDTO,session)
        // await notificationRepo.create({
        //     content: NOTIFICATIONCONTENT.FAILED_ORDER,
        //     type: NOTIFICATIONTYPE.FAILED_ORDER,
        //     r_order: tempFoundOrder._id
        // }, session)
        }

        else if (ORDERSTATUS.NEW === tempFoundOrder.status && exportOrderDTO.status === ORDERSTATUS.SHIPPING) {
        updatedOrder = await exportOrderRepo.updateStatus(exportOrderDTO,session)
        // await notificationRepo.create({
        //     content: NOTIFICATIONCONTENT.SHIPPING_ORDER,
        //     type: NOTIFICATIONTYPE.SHIPPING_ORDER,
        //     r_order: tempFoundOrder._id
        // }, session)
        }

        else if (ORDERSTATUS.SHIPPING === tempFoundOrder.status && exportOrderDTO.status === ORDERSTATUS.SUCCESS) {
        updatedOrder = await exportOrderRepo.updateStatus(exportOrderDTO,session)
        // await notificationRepo.create({
        //     content: NOTIFICATIONCONTENT.SUCCESS_ORDER,
        //     type: NOTIFICATIONTYPE.SUCCESS_ORDER,
        //     r_order: tempFoundOrder._id
        // }, session)
        }

        return Promise.resolve(updatedOrder[0])
    } catch (error) {
        (error)
        console.log(error)
        return Promise.reject(new CustomError(error.toString(),500))
    }
}

module.exports = { create, getAll, update }