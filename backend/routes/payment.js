const express = require("express")
const router = express.Router()
const MembershipPayment = require("../models/MembershipPayment")

router.post("/", async (req, res) => {
  try {
    const { vendor_id, business_id, plan, amount, payment_method } = req.body

    const payment = await MembershipPayment.create({
      vendor_id,
      business_id,
      plan,
      amount,
      payment_method,
      payment_status: "completed",
      transaction_id: "TXN" + Date.now(),
    })

    res.json({ success: true, payment })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Payment failed" })
  }
})

module.exports = router
