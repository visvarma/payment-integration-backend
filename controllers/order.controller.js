const OrderModel = require("../models/Order/Schema");
const ProductModel = require("../models/Product/schema");
const RazorpayService = require("../integrations/razorpay");

exports.createOrder = async (req, res, next) => {
  try {
    const { body } = req;
    // if (!body.user_id && !body.product_id)
    //   return res.status(400).json({ message: "Insufficient details" });
    console.log(body);
    const product = await ProductModel.findById(body.product_id);
    if (!product) return res.status(400).json({ message: "Invalid product" });
    body.amount = body.amount || product.price;
    const orderObj = {
      ...body,
      "product.id": product._id,
    };
    const order = new OrderModel(orderObj);
    const _order = await RazorpayService.createOrder(body.amount, "order");
    order.rzp_order_id = _order.id;
    await order.save();
    return res.status(201).json({
      order,
      _order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.find({
      user_id: req.params.user_id,
    }).populate("product.id");
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
