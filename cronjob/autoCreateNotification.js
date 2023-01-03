const { default: mongoose } = require('mongoose')
const cron = require('node-cron')
const consignmentService = require("../services/ConsignmentService")

const schedule = cron.schedule('* * * * * *', () => {
    async function createNotification(){
        const session = await mongoose.startSession()
        try {
            await session.withTransaction(async() => {
                await consignmentService.checkCommingOutOfStock(session)
            })
        } catch (error) {
            console.log(error)
        } finally {
            session.endSession();
        }
    }
    createNotification()
},
    {
        scheduled: false,
        timezone: "Asia/Ho_Chi_Minh"
    })

module.exports = schedule