// /api/check-coupon.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { coupon, cartId, authToken, userId, pin } = req.body;

    if (!coupon || !cartId || !authToken || !userId || !pin) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🚀 Checking coupon:", coupon);

    // JioMart coupon apply request
    const response = await axios.get(
      "https://www.jiomart.com/mst/rest/v1/5/cart/apply_coupon",
      {
        params: { coupon_code: coupon, cart_id: cartId },
        headers: {
          authtoken: authToken,
          userid: userId,
          pin: pin,
          Accept: "application/json, text/plain, */*"
        }
      }
    );

    // Return the coupon and API response to frontend
    return res.status(200).json({ coupon, result: response.data });

  } catch (err) {
    console.error("❌ Error checking coupon:", err.message);

    // Include response from JioMart if available
    const errorData = err.response?.data || { message: err.message };

    return res.status(500).json({
      error: "Failed to check coupon",
      details: errorData
    });
  }
}
