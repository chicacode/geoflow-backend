import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email info
  const info = await transport.sendMail({
    from: '"Geoflow - Project Management System" <accounts@geoflow.com>',
    to: email,
    subject: "Geoflow - Check your account",
    text: "Check your account in Geoflow",
    html: `<p>Hi: ${name} Check your account in Geoflow</p>
    <p>Your account is almost ready, you just have to check it in the following link: 

    <a href="${process.env.FRONTEND_URL}/activation/${token}">Activate your Account</a>
    
    <p>If you did not create this account, you can ignore the message</p>
    `,
  })
};

export const emailRecoverPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // email info
  const info = await transport.sendMail({
    from: '"Geoflow - Project Management System" <accounts@geoflow.com>',
    to: email,
    subject: "Geoflow - Reset your password",
    text: "Reset your password in Geoflow",
    html: `<p>Hi: ${name} You have requested tu reset your password in Geoflow</p>
    <p>Follow this link to generate a new password: </p>

    <a href="${process.env.FRONTEND_URL}/recover-password/${token}">Reset your password</a>
    
    <p>If you did not request this change, you can ignore the message</p>
    `,
  })
};