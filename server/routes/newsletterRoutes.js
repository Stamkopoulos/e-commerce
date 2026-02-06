import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ success: true, message: "Successfully subscribed!" });
    } else if (data.code === "duplicate_parameter") {
      return res.json({ success: true, message: "Already subscribed!" });
    } else {
      console.error("Brevo API error:", data);
      return res.status(400).json({
        error: data.message || "Failed to subscribe. Please try again.",
      });
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
});

export default router;
