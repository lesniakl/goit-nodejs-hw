import { default as FormData } from "form-data";
import "dotenv/config";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const sendToken = async (email, token) => {
  mg.messages.create("sandboxbe356248ee03472ba1f9f7ae6a3570c1.mailgun.org", {
    from: "Contact API <noreply@sandboxbe356248ee03472ba1f9f7ae6a3570c1.mailgun.org>",
    to: [email],
    subject: "Contact API Verification",
    text: `Use this URL to verify your account: /users/verify/${token}`,
    html: `<h1>Use this URL to verify your account:<br>/users/verify/${token}</h1>`,
  });
};

export { sendToken };
