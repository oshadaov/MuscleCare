import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import handlebars from "handlebars"

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Read email template file and compile with Handlebars
const readTemplate = (templateName) => {
  const templatePath = path.join(__dirname, `../templates/emails/${templateName}.html`)
  const source = fs.readFileSync(templatePath, "utf-8")
  return handlebars.compile(source)
}

// Send contact form confirmation email to user
export const sendContactConfirmation = async (email, name) => {
  try {
    const template = readTemplate("contact-confirmation")
    const htmlContent = template({
      name,
      year: new Date().getFullYear(),
    })

    const mailOptions = {
      from: `"Medical Booking" <${process.env.EMAIL_FROM}>`,
      to: "oshadaov@gmail.com",
      subject: "We received your message",
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Contact confirmation email sent to ${email}`)
    return true
  } catch (error) {
    console.error("Error sending contact confirmation email:", error)
    return false
  }
}

// Send notification to admin about new contact submission
export const sendAdminNotification = async (email, subject, data) => {
  try {
    const template = readTemplate("admin-notification")
    const htmlContent = template({
      ...data,
      adminUrl: process.env.ADMIN_URL || "http://localhost:5000",
      year: new Date().getFullYear(),
    })

    const mailOptions = {
      from: `"Medical Booking" <${process.env.EMAIL_FROM}>`,
      to: "oshadaov@gmail.com",
      subject: subject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Admin notification email sent to ${email}`)
    return true
  } catch (error) {
    console.error("Error sending admin notification email:", error)
    return false
  }
}

// Other email functions...

