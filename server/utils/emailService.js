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

// Send Admin Alert Email (Low Rating / Negative Sentiment)
const sendAlertEmail = async (alertData) => {
    const { providerName, rating, sentiment, sentimentScore, comment, alertType } = alertData;

    const transporter = createTransporter();

    const alertTypeLabel =
        alertType === 'both' ? '⭐ Low Rating + 😠 Negative Sentiment' :
            alertType === 'low_rating' ? '⭐ Low Rating' :
                '😠 Negative Sentiment';

    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

    const mailOptions = {
        from: `"ServeEase Alerts" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
        subject: `🚨 Provider Alert: ${alertTypeLabel} - ${providerName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ServeEase Admin Alert</title>
            </head>
            <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
                <div style="max-width:560px; margin:40px auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding:36px 40px 28px; text-align:center;">
                        <div style="display:inline-block; background:rgba(255,255,255,0.2); border-radius:16px; padding:10px 20px; margin-bottom:16px;">
                            <span style="color:#fff; font-weight:900; font-size:18px; letter-spacing:1px;">SE</span>
                        </div>
                        <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700;">🚨 Provider Alert</h1>
                        <p style="color:rgba(255,255,255,0.8); margin:6px 0 0; font-size:14px;">ServeEase ML Monitoring System</p>
                    </div>

                    <!-- Alert Type Badge -->
                    <div style="background:#fef2f2; border-bottom:1px solid #fecaca; padding:14px 20px; text-align:center;">
                        <div style="display:inline-flex; flex-wrap:wrap; gap:6px; justify-content:center; align-items:center;">
                            ${alertType === 'low_rating' || alertType === 'both' ? `<span style="background:#f59e0b; color:#fff; font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px; white-space:nowrap;">⭐ Low Rating</span>` : ''}
                            ${alertType === 'negative_sentiment' || alertType === 'both' ? `<span style="background:#dc2626; color:#fff; font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px; white-space:nowrap;">😠 Negative Sentiment</span>` : ''}
                        </div>
                    </div>

                    <!-- Body -->
                    <div style="padding:36px 40px;">
                        <p style="color:#64748b; font-size:15px; margin:0 0 24px; line-height:1.6;">
                            Our <strong>ML Sentiment Analysis</strong> system has flagged a concern. Immediate review recommended.
                        </p>

                        <!-- Provider Info -->
                        <div style="background:#f8fafc; border-radius:16px; padding:24px; margin-bottom:20px; border:1px solid #e2e8f0;">
                            <h3 style="color:#0f172a; font-size:16px; margin:0 0 16px; font-weight:700;">📋 Alert Details</h3>
                            <table style="width:100%; border-collapse:collapse;">
                                <tr>
                                    <td style="color:#64748b; font-size:14px; padding:6px 0; width:40%;">Provider</td>
                                    <td style="color:#0f172a; font-size:14px; font-weight:600; padding:6px 0;">${providerName}</td>
                                </tr>
                                <tr>
                                    <td style="color:#64748b; font-size:14px; padding:6px 0;">Rating</td>
                                    <td style="color:#0f172a; font-size:14px; font-weight:600; padding:6px 0;">${stars} (${rating}/5)</td>
                                </tr>
                                <tr>
                                    <td style="color:#64748b; font-size:14px; padding:6px 0;">ML Sentiment</td>
                                    <td style="color:#dc2626; font-size:14px; font-weight:700; padding:6px 0; text-transform:capitalize;">${sentiment} (score: ${sentimentScore})</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Review Comment -->
                        <div style="background:#fff7ed; border-left:4px solid #f97316; border-radius:8px; padding:16px 20px; margin-bottom:28px;">
                            <p style="color:#9a3412; font-size:12px; font-weight:700; margin:0 0 8px; text-transform:uppercase; letter-spacing:1px;">Customer Review</p>
                            <p style="color:#431407; font-size:14px; margin:0; line-height:1.6; font-style:italic;">"${comment}"</p>
                        </div>

                        <p style="color:#94a3b8; font-size:13px; margin:0; line-height:1.6;">
                            🔍 Please login to the Admin Dashboard to review and take appropriate action.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
                        <p style="color:#cbd5e1; font-size:12px; margin:0;">
                            © 2026 ServeEase · Automated ML Alert System
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Send Forgot Password OTP Email
const sendForgotPasswordOTPEmail = async (toEmail, otp, userName) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"ServeEase" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject: '🔑 Password Reset OTP - ServeEase',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ServeEase Password Reset</title>
            </head>
            <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
                <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding:40px 40px 32px; text-align:center;">
                        <div style="display:inline-block; background:rgba(255,255,255,0.2); border-radius:16px; padding:10px 20px; margin-bottom:16px;">
                            <span style="color:#fff; font-weight:900; font-size:18px; letter-spacing:1px;">SE</span>
                        </div>
                        <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">ServeEase</h1>
                        <p style="color:rgba(255,255,255,0.8); margin:6px 0 0; font-size:14px;">Password Reset Request</p>
                    </div>

                    <!-- Body -->
                    <div style="padding:40px;">
                        <div style="text-align:center; margin-bottom:24px;">
                            <div style="display:inline-block; background:#ede9fe; border-radius:50%; width:64px; height:64px; line-height:64px; font-size:32px;">🔑</div>
                        </div>
                        <h2 style="color:#0f172a; font-size:20px; font-weight:700; margin:0 0 8px;">Hello, ${userName}! 👋</h2>
                        <p style="color:#64748b; font-size:15px; line-height:1.6; margin:0 0 32px;">
                            We received a request to reset your <strong>ServeEase</strong> account password. Use the OTP below to proceed. This OTP is valid for <strong>5 minutes</strong>.
                        </p>

                        <!-- OTP Box -->
                        <div style="background:#f5f3ff; border:2px dashed #7c3aed; border-radius:16px; padding:28px; text-align:center; margin-bottom:32px;">
                            <p style="color:#5b21b6; font-size:13px; font-weight:600; margin:0 0 12px; text-transform:uppercase; letter-spacing:1px;">Your Password Reset OTP</p>
                            <div style="font-size:48px; font-weight:900; letter-spacing:12px; color:#6d28d9; font-family:'Courier New', monospace;">${otp}</div>
                            <p style="color:#7c3aed; font-size:12px; margin:12px 0 0;">⏱ Expires in 5 minutes</p>
                        </div>

                        <!-- Warning -->
                        <div style="background:#fef2f2; border-left:4px solid #f87171; border-radius:8px; padding:16px; margin-bottom:24px;">
                            <p style="color:#991b1b; font-size:13px; margin:0; line-height:1.5;">
                                🔒 <strong>Never share this OTP</strong> with anyone. ServeEase will never ask for your OTP via phone or email.
                            </p>
                        </div>

                        <p style="color:#94a3b8; font-size:13px; margin:0;">
                            If you didn't request a password reset, please ignore this email. Your account remains secure.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
                        <p style="color:#cbd5e1; font-size:12px; margin:0;">
                            © 2026 ServeEase. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendAlertEmail, sendForgotPasswordOTPEmail };

