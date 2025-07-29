import { Resend } from 'resend';

const resend = new Resend('re_EUKHPhmo_FftZ4NpiT825yFVYxgUwcsXc');

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin bắt buộc: to, subject, html' 
      });
    }

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html
    });

    res.json({ 
      success: true, 
      message: 'Email đã được gửi thành công',
      data: result 
    });

  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    res.status(500).json({ 
      error: 'Lỗi khi gửi email',
      details: error.message 
    });
  }
};

export const sendOTPEmail = async (req, res) => {
  try {
    const { to, otp, appName = 'Jollicow' } = req.body;

    if (!to || !otp) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin bắt buộc: to, otp' 
      });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
          }
          .logo {
            width: 60px;
            height: 60px;
            background-color: #ffffff;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .logo-icon {
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 30px;
            font-weight: 500;
          }
          .otp-container {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
          }
          .otp-label {
            color: #ffffff;
            font-size: 14px;
            margin-top: 10px;
            opacity: 0.9;
          }
          .info {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #667eea;
          }
          .info p {
            margin: 8px 0;
            color: #555555;
            font-size: 14px;
            line-height: 1.5;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .warning p {
            margin: 0;
            color: #856404;
            font-size: 13px;
            line-height: 1.4;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 12px;
          }
          .contact {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 0;
            }
            .header, .content, .footer {
              padding: 20px 15px;
            }
            .otp-code {
              font-size: 28px;
              letter-spacing: 6px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-icon">J</div>
            </div>
            <h1>${appName}</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Hi there,</div>
            
            <div class="otp-container">
              <div class="otp-label">Your OTP is:</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-label">Please use the OTP to complete your login process.</div>
            </div>
            
            <div class="info">
              <p><strong>OTP is valid for 4 minutes.</strong></p>
              <p>This code will expire automatically for security reasons.</p>
            </div>
            
            <div class="warning">
              <p><strong>Security Notice:</strong> If you didn't try to login just now, please ignore this email and contact our support team immediately.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Feel free to contact us for any assistance by replying to this email.</p>
            <p><strong>Regards,</strong><br>${appName} Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: `Your OTP Code - ${appName}`,
      html: htmlContent
    });

    res.json({ 
      success: true, 
      message: 'OTP email đã được gửi thành công',
      data: result 
    });

  } catch (error) {
    console.error('Lỗi khi gửi OTP email:', error);
    res.status(500).json({ 
      error: 'Lỗi khi gửi OTP email',
      details: error.message 
    });
  }
};