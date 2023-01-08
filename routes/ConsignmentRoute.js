const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { updateConsignmentDto } = require("../dtos/ConsignmentDTO");
const { CustomError } = require("../errors/CustomError");
const router = Router({ mergeParams: true });
const consignmentService = require("../services/ConsignmentService");

router
  .get("/", async (req, res) => {
    try {
      const consignment = await consignmentService.getAll()
      return res.status(200).json(consignment)
    } catch (error) {
      res.status(500).json(error)
    }
  })
  .put("/:id", async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const consignmentDTO = updateConsignmentDto({...req.body, id: req.params.id});
      if (consignmentDTO.hasOwnProperty("errMessage"))
        throw new CustomError(consignmentDTO.errMessage, 400);
      const updatedConsignment = await consignmentService.updateStatus(
        consignmentDTO.data,
        session
      );
      await session.commitTransaction();
      res.status(200).json(updatedConsignment);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();

      if (error instanceof CustomError)
        res.status(error.code).json({ message: error.message });
      else res.status(500).json({message:"Server has something wrong!!"});
    } finally {
      session.endSession();
    }
  })

module.exports = { router };
