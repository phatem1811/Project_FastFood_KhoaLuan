
const transporter = require("../config/emailConfig");
require("dotenv").config();
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); 
}

async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.MAIL_PASSWORD, 
    to: email, 
    subject: "Xác minh tài khoản của bạn",
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP đã được gửi thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
  }
}

module.exports = { generateOTP, sendOTP };
