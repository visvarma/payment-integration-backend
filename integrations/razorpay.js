const Razorpay = require("razorpay");
const shortid = require("shortid");
const OrderModel = require("../models/Order/Schema");
console.log(process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount, order_type) => {
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    console.log("webhook call");
    const SECRET = "vrv@1998";
    const crypto = require("crypto");
    const shasum = crypto.createHmac("sha256", SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      // process it
      const { payload } = req.body;
      console.log(payload.payment.entity.order_id);
      const { order_id } = payload.payment.entity;
      let paymentEntity;
      paymentEntity = await OrderModel.findOne({
        rzp_order_id: order_id,
      });

      if (!paymentEntity)
        return res.status(400).json({ message: "Invalid booking/order id" });
      paymentEntity.payment_status = "paid";
      paymentEntity.payment_details = req.body;
      await paymentEntity.save();
      return res.json({ status: "ok" });
    } else {
      // pass it
      console.log("signature not matching");
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
