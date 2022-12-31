const rateRepo = require("../repositories/RateRepo");
const exportOrderRepo = require("../repositories/ExportOrderRepo");
const { CustomError } = require("../errors/CustomError");

function getByProductId(id) {
  return rateRepo.getByProductId(id);
}

async function create(rateDTO,session) {
  try {
    const foundExportOrder = await exportOrderRepo.getById(rateDTO.r_order)
    if(foundExportOrder.isRated)
      return Promise.reject(new CustomError("Đơn hàng này đã được đánh giá", 400))

    await exportOrderRepo.updateStatus({id: rateDTO.r_order, isRated: true},session)
    
    await rateRepo.create(rateDTO,session);
    return Promise.resolve()
  } catch (error) {
    throw new CustomError(error.toString(), 500);
  }
}

module.exports = { create, getByProductId };
