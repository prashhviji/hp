const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

// server used to send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running on port 5000"));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "hari.kdh7376@gmail.com",
    pass: "rsnb yobo ddku phrf"  // Make sure this is an App Password from Gmail
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log("Error verifying email configuration:", error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", async (req, res) => {
  try {
    const name = req.body.firstName + " " + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }

    const mail = {
      from: `${name} <${email}>`,
      to: "hari.kdh7376@gmail.com",  // Replace with your receiving email
      subject: "Contact Form Submission - Portfolio",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await contactEmail.sendMail(mail);
    res.status(200).json({ status: "Message Sent Successfully" });
    
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});