const {Router} = require('express')
const router = Router({mergeParams:true})

const {router:categoryRouter} = require('./CategoryRoute') 
const {router:trademarkRouter} = require('./TrademarkRoute')
const {router:userRouter} = require('./UserRoute')
const {router:productRouter} = require('./ProductRoute')
const {router:importOrderRoute} = require('./ImportOrderRoute')
const {router:exportOrderRoute} = require('./ExportOrderRoute')
const {router:momoRoute} = require('./MomoRoute')

router.use('/category',categoryRouter)
router.use('/trademark',trademarkRouter)
router.use('/user',userRouter)
router.use('/product',productRouter)
router.use('/importOrder',importOrderRoute)
router.use('/exportOrder',exportOrderRoute)
router.use('/momo',momoRoute)

module.exports = router