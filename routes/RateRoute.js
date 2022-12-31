const { Router } = require("express");
const router = Router({ mergeParams: true });
const RateService = require("../services/RateService");
const { createRateDto } = require("../dtos/rateDTO");
const { CustomError } = require("../errors/CustomError");
const { default: mongoose } = require("mongoose");
const { verifyToken } = require("../middlewares/VerifyToken");

router
  .post("/", verifyToken,async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const rateDTO = createRateDto(req.body);
      if (rateDTO.hasOwnProperty("errMessage"))
        throw new CustomError(rateDTO.errMessage, 400);
      if(req.user.id !== rateDTO.data.r_user)
        throw new CustomError("bạn không phải tài khoản mua hàng", 400);

      await RateService.create(rateDTO.data);
      await session.commitTransaction();
      res.status(201).json({message: "tạo thành công"});
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof CustomError)
        res.status(error.code).json({ message: error.message });
      else res.status(500).json({message:"Server has something wrong!!"});
      console.error(error.toString());
    }
  })
  .get("/byProduct/:id", async (req, res) => {
    try {
      const rates = await RateService.getByProductId(req.params.id);
      return res.status(200).json(rates);
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = { router };
