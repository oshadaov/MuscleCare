import twilio from "twilio"
import dotenv from "dotenv"

dotenv.config()

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const sendWhatsAppMessage = async (message) => {
  console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID)
  console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN)
  console.log("TWILIO_WHATSAPP_NUMBER:", process.env.TWILIO_WHATSAPP_NUMBER)
  console.log("YOUR_PHONE_NUMBER:", process.env.YOUR_PHONE_NUMBER) // Debugging

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.YOUR_PHONE_NUMBER,
      body: message,
    })
    console.log("WhatsApp message sent:", response.sid)
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
  }
}
