const {Router} = require('express')
const router = Router({mergeParams:true})

const {router:categoryRouter} = require('./CategoryRoute') 
const {router:trademarkRouter} = require('./TrademarkRoute')
const {router:userRouter} = require('./UserRoute')
const {router:productRouter} = require('./ProductRoute')
const {router:importOrderRoute} = require('./ImportOrderRoute')
const {router:exportOrderRoute} = require('./ExportOrderRoute')
const {router:momoRoute} = require('./MomoRoute')
const {router:rateRoute} = require('./RateRoute')
const { router: statisticRouter } = require("./StatictisRoute");
const { router: notificationRouter } = require("./NotificationRoute");
const { router: consignmentRouter } = require("./ConsignmentRoute");
const { router: permissionRouter } = require("./PermissionRoute");
const { router: roleRouter } = require("./RoleRoute");
const { router: protectedRouter } = require("./ProtectedRoute");

router.use('/category',categoryRouter)
router.use('/trademark',trademarkRouter)
router.use('/user',userRouter)
router.use('/product',productRouter)
router.use('/importOrder',importOrderRoute)
router.use('/exportOrder',exportOrderRoute)
router.use('/momo',momoRoute)
router.use('/rate',rateRoute)
router.use("/statistic", statisticRouter);
router.use("/notification", notificationRouter);
router.use("/consignment", consignmentRouter);
router.use("/permission", permissionRouter);
router.use("/role", roleRouter);
router.use("/protected", protectedRouter);

module.exports = router