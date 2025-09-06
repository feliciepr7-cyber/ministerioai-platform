import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Email templates for ticket notifications
export function generateTicketCreatedEmail(
  userEmail: string,
  userName: string | null,
  ticketNumber: string,
  ticketTitle: string
): EmailParams {
  const subject = `Support Ticket Created: ${ticketNumber}`;
  const text = `
Hi ${userName || 'User'},

Your support ticket has been created successfully.

Ticket Details:
- Ticket Number: ${ticketNumber}
- Title: ${ticketTitle}

Our support team will review your request and respond as soon as possible. You can track the progress of your ticket in your dashboard.

Best regards,
Ministerio AI Support Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Support Ticket Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">Support Ticket Created</h1>
        </div>
        
        <p>Hi <strong>${userName || 'User'}</strong>,</p>
        
        <p>Your support ticket has been created successfully.</p>
        
        <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Ticket Details:</h3>
            <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
            <p style="margin: 5px 0;"><strong>Title:</strong> ${ticketTitle}</p>
        </div>
        
        <p>Our support team will review your request and respond as soon as possible. You can track the progress of your ticket in your dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>Ministerio AI Support Team</strong>
            </p>
        </div>
    </div>
</body>
</html>
`;

  return {
    to: userEmail,
    from: 'support@ministerio-ai.com' as string, // You should replace with your verified sender email
    subject,
    text,
    html,
  };
}

export function generateTicketStatusUpdatedEmail(
  userEmail: string,
  userName: string | null,
  ticketNumber: string,
  ticketTitle: string,
  oldStatus: string,
  newStatus: string
): EmailParams {
  const subject = `Ticket ${ticketNumber} Status Updated: ${newStatus.replace('_', ' ').toUpperCase()}`;
  
  const statusMessages = {
    open: "Your ticket has been reopened and is awaiting review.",
    in_progress: "Our team is now working on your ticket.",
    on_hold: "Your ticket has been placed on hold pending additional information.",
    resolved: "Your ticket has been resolved. Please review our response.",
    closed: "Your ticket has been closed. If you need further assistance, please create a new ticket."
  };

  const statusMessage = statusMessages[newStatus as keyof typeof statusMessages] || "Your ticket status has been updated.";

  const text = `
Hi ${userName || 'User'},

The status of your support ticket has been updated.

Ticket Details:
- Ticket Number: ${ticketNumber}
- Title: ${ticketTitle}
- Previous Status: ${oldStatus.replace('_', ' ').toUpperCase()}
- New Status: ${newStatus.replace('_', ' ').toUpperCase()}

${statusMessage}

You can view the full details and any new responses in your dashboard.

Best regards,
Ministerio AI Support Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket Status Updated</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">Ticket Status Updated</h1>
        </div>
        
        <p>Hi <strong>${userName || 'User'}</strong>,</p>
        
        <p>The status of your support ticket has been updated.</p>
        
        <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Ticket Details:</h3>
            <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
            <p style="margin: 5px 0;"><strong>Title:</strong> ${ticketTitle}</p>
            <p style="margin: 5px 0;"><strong>Previous Status:</strong> <span style="color: #6b7280;">${oldStatus.replace('_', ' ').toUpperCase()}</span></p>
            <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: #16a34a; font-weight: bold;">${newStatus.replace('_', ' ').toUpperCase()}</span></p>
        </div>
        
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;">${statusMessage}</p>
        </div>
        
        <p>You can view the full details and any new responses in your dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>Ministerio AI Support Team</strong>
            </p>
        </div>
    </div>
</body>
</html>
`;

  return {
    to: userEmail,
    from: 'support@ministerio-ai.com' as string, // You should replace with your verified sender email
    subject,
    text,
    html,
  };
}

export function generateTicketCommentEmail(
  userEmail: string,
  userName: string | null,
  ticketNumber: string,
  ticketTitle: string,
  commentAuthor: string,
  commentContent: string
): EmailParams {
  const subject = `New Response on Ticket ${ticketNumber}`;
  
  const text = `
Hi ${userName || 'User'},

There's a new response on your support ticket.

Ticket Details:
- Ticket Number: ${ticketNumber}
- Title: ${ticketTitle}

Response from ${commentAuthor}:
${commentContent}

You can view the full conversation and respond in your dashboard.

Best regards,
Ministerio AI Support Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Response on Your Ticket</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">New Response on Your Ticket</h1>
        </div>
        
        <p>Hi <strong>${userName || 'User'}</strong>,</p>
        
        <p>There's a new response on your support ticket.</p>
        
        <div style="background: #e7f3ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Ticket Details:</h3>
            <p style="margin: 5px 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
            <p style="margin: 5px 0;"><strong>Title:</strong> ${ticketTitle}</p>
        </div>
        
        <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #374151;">Response from ${commentAuthor}:</p>
            <div style="background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #3b82f6;">
                <p style="margin: 0; white-space: pre-wrap;">${commentContent}</p>
            </div>
        </div>
        
        <p>You can view the full conversation and respond in your dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>Ministerio AI Support Team</strong>
            </p>
        </div>
    </div>
</body>
</html>
`;

  return {
    to: userEmail,
    from: 'support@ministerio-ai.com' as string, // You should replace with your verified sender email
    subject,
    text,
    html,
  };
}