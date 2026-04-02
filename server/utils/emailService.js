const nodemailer = require('nodemailer');

// Create transporter — works with Mailtrap (dev) & Gmail (prod)
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send OTP Email
const sendOTPEmail = async (toEmail, otp, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"ServeEase" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject: '🔐 Your Login OTP - ServeEase',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ServeEase OTP</title>
            </head>
            <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
                <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #f97316, #ef4444); padding:40px 40px 32px; text-align:center;">
                        <div style="display:inline-block; background:rgba(255,255,255,0.2); border-radius:16px; padding:10px 20px; margin-bottom:16px;">
                            <span style="color:#fff; font-weight:900; font-size:18px; letter-spacing:1px;">SE</span>
                        </div>
                        <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">ServeEase</h1>
                        <p style="color:rgba(255,255,255,0.8); margin:6px 0 0; font-size:14px;">Professional Services at Your Doorstep</p>
                    </div>

                    <!-- Body -->
                    <div style="padding:40px;">
                        <h2 style="color:#0f172a; font-size:20px; font-weight:700; margin:0 0 8px;">Hello, ${userName}! 👋</h2>
                        <p style="color:#64748b; font-size:15px; line-height:1.6; margin:0 0 32px;">
                            We received a login request for your ServeEase account. Use the OTP below to complete verification. This OTP is valid for <strong>5 minutes</strong>.
                        </p>

                        <!-- OTP Box -->
                        <div style="background:#fff7ed; border:2px dashed #f97316; border-radius:16px; padding:28px; text-align:center; margin-bottom:32px;">
                            <p style="color:#9a3412; font-size:13px; font-weight:600; margin:0 0 12px; text-transform:uppercase; letter-spacing:1px;">Your One-Time Password</p>
                            <div style="font-size:48px; font-weight:900; letter-spacing:12px; color:#ea580c; font-family:'Courier New', monospace;">${otp}</div>
                            <p style="color:#c2410c; font-size:12px; margin:12px 0 0;">⏱ Expires in 5 minutes</p>
                        </div>

                        <!-- Warning -->
                        <div style="background:#fef2f2; border-left:4px solid #f87171; border-radius:8px; padding:16px; margin-bottom:24px;">
                            <p style="color:#991b1b; font-size:13px; margin:0; line-height:1.5;">
                                🔒 <strong>Never share this OTP</strong> with anyone. ServeEase will never ask for your OTP via phone or email.
                            </p>
                        </div>

                        <p style="color:#94a3b8; font-size:13px; margin:0;">
                            If you didn't request this login, ignore this email. Your account is safe.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
                        <p style="color:#cbd5e1; font-size:12px; margin:0;">
                            © 2024 ServeEase. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
