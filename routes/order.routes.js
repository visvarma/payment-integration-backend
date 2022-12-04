const router = require("express").Router();
const OrderController = require("../controllers/order.controller");
const { verifyPayment } = require("../integrations/razorpay");

router.post("/order/create", OrderController.createOrder);
router.post("/order/verify_payment", verifyPayment);
router.get("/order/get_all/:user_id", OrderController.getAllOrder);
// router.get('/:order_id', OrderController.getOrder)

module.exports = router;
