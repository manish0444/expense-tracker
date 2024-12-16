import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log('Starting email send process...')

  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    throw new Error('Email configuration missing')
  }

  const transportConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  }

  console.log('Creating transport with config:', {
    host: transportConfig.host,
    port: transportConfig.port,
    secure: transportConfig.secure,
    authUser: transportConfig.auth.user
  })

  const transporter = nodemailer.createTransport(transportConfig)

  try {
    console.log('Verifying SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    console.log('Sending email...')
    const info = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_SERVER_USER}>`,
      to,
      subject,
      html,
    })

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    })

    return info
  } catch (error) {
    console.error('Detailed email error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        host: transportConfig.host,
        port: transportConfig.port,
        user: transportConfig.auth.user
      }
    })
    throw error
  }
} 