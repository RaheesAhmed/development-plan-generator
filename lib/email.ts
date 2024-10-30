import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInvitationEmail(email: string, assessmentId: string) {
  const assessmentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assessment/${assessmentId}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "You've been invited to provide feedback",
    html: `
      <h1>Leadership Assessment Invitation</h1>
      <p>You've been invited to provide feedback as part of a leadership assessment.</p>
      <p>Please click the link below to complete your assessment:</p>
      <a href="${assessmentUrl}">${assessmentUrl}</a>
    `,
  });
}
