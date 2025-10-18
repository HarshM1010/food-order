require("dotenv").config();
const twilio = require("twilio");

console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("AUTH TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded ✅" : "Missing ❌");
console.log("VERIFY SID:", process.env.TWILIO_VERIFY_SID);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.verify.v2
  .services(process.env.TWILIO_VERIFY_SID)
  .verifications.create({ to: "+911234567890", channel: "sms" })
  .then(v => console.log("✅ OTP sent:", v.status))
  .catch(err => console.error("❌ Twilio auth failed:", err.message));