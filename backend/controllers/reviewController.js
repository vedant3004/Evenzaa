const db = require("../db") // tumhara mysql connection file

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { vendorId, rating, comment } = req.body

    if (!vendorId || !rating || !comment) {
      return res.status(400).json({ message: "All fields required" })
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id

    const sql = `
      INSERT INTO reviews (vendor_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `

    await db.query(sql, [vendorId, userId, rating, comment])

    res.status(201).json({ message: "Review added successfully" })
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error)
    res.status(500).json({ message: "Server Error" })
  }
}


// GET REVIEWS
exports.getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.params.vendorId

    const sql = `
      SELECT r.*, u.name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.vendor_id = ?
      ORDER BY r.created_at DESC
    `

    const [reviews] = await db.query(sql, [vendorId])

    const avgSql = `
      SELECT AVG(rating) as avgRating, COUNT(*) as total
      FROM reviews
      WHERE vendor_id = ?
    `

    const [avgData] = await db.query(avgSql, [vendorId])

    res.json({
      reviews,
      avgRating: avgData[0].avgRating
        ? Number(avgData[0].avgRating).toFixed(1)
        : 0,
      total: avgData[0].total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
