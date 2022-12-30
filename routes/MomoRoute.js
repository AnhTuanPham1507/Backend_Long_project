const { Router } = require("express");
const router = Router({ mergeParams: true });

const { CustomError } = require("../errors/CustomError");
const { default: mongoose } = require("mongoose");
const { notificationMoMoDto } = require("../dtos/MomoDTO");
const { updateOrderAndPaymentStatus } = require("../services/MomoService");

router
    .post("/notification", async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const notificationMoMoDTO = notificationMoMoDto(req.body)
            if (notificationMoMoDTO.hasOwnProperty("errMessage"))
                throw new CustomError(notificationMoMoDTO.errMessage, 400)
            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            const rawSignature = "accessKey=" + notificationMoMoDTO.data.accessKey + "&amount=" + notificationMoMoDTO.data.amount + "&extraData=" + notificationMoMoDTO.data.extraData + "&message=" + notificationMoMoDTO.data.message + "&orderId=" + notificationMoMoDTO.data.orderId + "&orderInfo=" + notificationMoMoDTO.data.orderInfo + "&orderType=" + notificationMoMoDTO.data.orderType + "&partnerCode=" + notificationMoMoDTO.data.partnerCode + "&payType=" + notificationMoMoDTO.data.payType + "&requestId=" + notificationMoMoDTO.data.requestId + "&responseTime=" + notificationMoMoDTO.data.responseTime + "&resultCode=" + notificationMoMoDTO.data.resultCode + "&transId=" + notificationMoMoDTO.data.transId
            // //puts raw signature

            //signature
            const crypto = require('crypto');
            const signature = crypto.createHmac('sha256', notificationMoMoDTO.data.secretKey)
                .update(rawSignature)
                .digest('hex');
            console.log(signature)
            console.log(notificationMoMoDTO.data.signature)
            if (signature === notificationMoMoDTO.data.signature && notificationMoMoDTO.data.resultCode == 0) {
                await updateOrderAndPaymentStatus({
                    paymentId: notificationMoMoDTO.data.extraData,
                    orderId: notificationMoMoDTO.data.orderId,
                    momoId: notificationMoMoDTO.data.transId
                },session) 
                await session.commitTransaction();
                console.log("thanh cong")
                return res.status(200).json({ message: "thanh cong" })
            } else {
                throw new CustomError("Xác thực signature không thành công", 400)
            }

        } catch (error) {
            await session.abortTransaction();
            console.log(error)
            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message });
            else res.status(500).json({ message: "Server has something wrong!!" });
        } finally {
            session.endSession();
        }
    })

module.exports = { router };
