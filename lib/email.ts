// Email sending is stubbed out — install 'resend' and add RESEND_API_KEY to enable
const FROM = process.env.EMAIL_FROM || "noreply@dataverseai.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const resend = {
  emails: {
    send: async (payload: Record<string, unknown>) => {
      console.log("[email stub] would send:", payload);
      return { id: "stub" };
    }
  }
};

// ── Welcome Email ─────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to DataVerse AI 🎉",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:Inter,system-ui,sans-serif;color:#f0f6fc">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid #1e3a5f;border-radius:16px;overflow:hidden;max-width:600px;width:100%">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0891b2,#059669);padding:40px 40px 32px;text-align:center">
          <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,0.15);border-radius:50px;padding:10px 20px">
            <span style="font-size:20px">🌐</span>
            <span style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.5px">DataVerse AI</span>
          </div>
          <h1 style="color:#fff;font-size:28px;font-weight:900;margin:24px 0 8px;letter-spacing:-0.5px">Welcome aboard, ${name}!</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0">India's most powerful open data platform</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <p style="color:#94a3b8;font-size:16px;line-height:1.7;margin:0 0 24px">
            Your DataVerse AI account is ready. You now have access to <strong style="color:#67e8f9">10,000+ verified datasets</strong> across Population, Crime, Literacy Rate, Healthcare, Agriculture, and more.
          </p>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;margin:0 0 32px">
            <h3 style="color:#f0f6fc;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px">What you can do</h3>
            <div style="display:flex;flex-direction:column;gap:12px">
              ${["🔍 AI-powered dataset search", "📊 Interactive dashboards", "⬇️ Direct CSV/JSON/XLSX downloads", "🔖 Save and bookmark datasets"].map(f => `<div style="color:#94a3b8;font-size:14px">${f}</div>`).join("")}
            </div>
          </div>
          <div style="text-align:center">
            <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#0891b2,#059669);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px">
              Explore DataVerse AI →
            </a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="border-top:1px solid #1e293b;padding:24px 40px;text-align:center">
          <p style="color:#475569;font-size:12px;margin:0">© 2026 DataVerse AI · Unified Open Data Hub for India</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}

// ── Email Verification ────────────────────────────────────────────
export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your DataVerse AI email address",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:Inter,system-ui,sans-serif;color:#f0f6fc">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid #1e3a5f;border-radius:16px;overflow:hidden;max-width:600px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#0891b2,#059669);padding:40px;text-align:center">
          <div style="font-size:48px;margin-bottom:16px">✉️</div>
          <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 8px">Verify your email</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0">Hi ${name}, confirm your DataVerse AI account</p>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="color:#94a3b8;font-size:16px;line-height:1.7;margin:0 0 32px">
            Click the button below to verify your email address. This link expires in <strong style="color:#67e8f9">24 hours</strong>.
          </p>
          <div style="text-align:center;margin:0 0 32px">
            <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#0891b2,#059669);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px">
              Verify Email Address
            </a>
          </div>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px;word-break:break-all">
            <p style="color:#475569;font-size:12px;margin:0 0 8px">Or copy this link:</p>
            <p style="color:#67e8f9;font-size:12px;margin:0;font-family:monospace">${verifyUrl}</p>
          </div>
          <p style="color:#475569;font-size:13px;margin:24px 0 0">If you didn't create an account, you can safely ignore this email.</p>
        </td></tr>
        <tr><td style="border-top:1px solid #1e293b;padding:24px 40px;text-align:center">
          <p style="color:#475569;font-size:12px;margin:0">© 2026 DataVerse AI · Unified Open Data Hub for India</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}

// ── Password Reset Email ──────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your DataVerse AI password",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:Inter,system-ui,sans-serif;color:#f0f6fc">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid #1e3a5f;border-radius:16px;overflow:hidden;max-width:600px;width:100%">
        <tr><td style="background:linear-gradient(135deg,#dc2626,#9333ea);padding:40px;text-align:center">
          <div style="font-size:48px;margin-bottom:16px">🔐</div>
          <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 8px">Reset your password</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0">Hi ${name}, we received a password reset request</p>
        </td></tr>
        <tr><td style="padding:40px">
          <p style="color:#94a3b8;font-size:16px;line-height:1.7;margin:0 0 32px">
            Click the button below to reset your password. This link expires in <strong style="color:#f87171">30 minutes</strong>.
          </p>
          <div style="text-align:center;margin:0 0 32px">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#9333ea);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px">
              Reset Password
            </a>
          </div>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px;word-break:break-all">
            <p style="color:#475569;font-size:12px;margin:0 0 8px">Or copy this link:</p>
            <p style="color:#f87171;font-size:12px;margin:0;font-family:monospace">${resetUrl}</p>
          </div>
          <div style="background:#1e293b;border:1px solid #f87171/30;border-radius:12px;padding:16px;margin:24px 0 0">
            <p style="color:#f87171;font-size:13px;margin:0">⚠️ If you didn't request this, please ignore this email. Your password will not change.</p>
          </div>
        </td></tr>
        <tr><td style="border-top:1px solid #1e293b;padding:24px 40px;text-align:center">
          <p style="color:#475569;font-size:12px;margin:0">© 2026 DataVerse AI · Unified Open Data Hub for India</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}
