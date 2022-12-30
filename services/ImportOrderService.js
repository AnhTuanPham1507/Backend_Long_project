const importOrderRepo = require('../repositories/ImportOrderRepo')

const importOrderDetailService = require("./ImportOrderDetailService")
const consignmentService = require("./ConsignmentService")

const { CustomError } = require('../errors/CustomError')

function getAll() {
    return importOrderRepo.getAll()
}

async function create(importOrderDTO, session) {
    try {
        const details = importOrderDTO.r_importOrderDetails
        const creatingConsignments = []
        details.forEach(detail => {
            creatingConsignments.push(
                {
                    quantity: detail.quantity,
                    importedAt: importOrderDTO.importedAt,
                    r_product: detail.r_product,
                    size: detail.size,
                    status: detail.consignmentStatus
                }
            )
            delete detail.consignmentStatus
        })
        await consignmentService.createMany(creatingConsignments, session)
        const createdImportProductDetails = await importOrderDetailService.createMany(details, session)
        const createdImportOrder = await importOrderRepo.create({
            totalPrice: importOrderDTO.totalPrice,
            r_importOrderDetails: createdImportProductDetails,
            r_user: importOrderDTO.r_user
        }, session)
        return Promise.resolve(createdImportOrder)

    } catch (error) {
        return Promise.reject(new CustomError(error.toString(),500))
    }

}

module.exports = { getAll, create }