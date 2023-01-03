const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { updateNotificationDto } = require("../dtos/NotificationDTO");
const { CustomError } = require("../errors/CustomError");
const router = Router({ mergeParams: true });

const notificationService = require("../services/NotificationService");

router
    .put("/:id", async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const notificationDTO = updateNotificationDto(req.params.id)
            if (notificationDTO.hasOwnProperty("errMessage"))
                throw new CustomError(notificationDTO.errMessage, 400)
            const updatedNotification = await notificationService.UpdateIsRead(notificationDTO.data.id,session)
            await session.commitTransaction()
            res.status(200).json(updatedNotification)
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (error instanceof CustomError)
                res.status(error.code).json({ message: error.message })
            else
                res.status(500).json({ message: "Server has something wrong!!" })
            console.error(error.toString())
        }
    })
    .get("/admin", async (req, res) => {
        try {
            const foundNotifications = await notificationService.getAllForAdmin()
            return res.status(200).json(foundNotifications);
        } catch (error) {
            return res.status(500).json(error.toString());
        }
    });

module.exports = { router };
