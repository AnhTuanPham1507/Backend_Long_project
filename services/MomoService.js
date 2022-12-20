const exportOrderRepo = require("../repositories/ExportOrderRepo");
const paymentRepo = require("../repositories/PaymentRepo");
const { CustomError } = require("../errors/CustomError");
const EXPORTORDERSTATUS = require("../enums/ExportOrderStatus")
const PAYMENTSTATUS = require("../enums/PaymentStatus")

async function updateOrderAndPaymentStatus({orderId, paymentId, momoId}, session) {
  try {
    await exportOrderRepo.updateStatus({id: orderId, status: EXPORTORDERSTATUS.SHIPPING, isPaid: true},session)
    await paymentRepo.updateStatus({id: paymentId, status: PAYMENTSTATUS.PAID, momoId},session)
    return Promise.resolve()
  } 
  catch (error) {
    throw new CustomError(error.toString(), 500);
  }
}

module.exports = { updateOrderAndPaymentStatus };
