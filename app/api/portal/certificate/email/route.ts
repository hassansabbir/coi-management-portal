import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { generateCOI } from '@/lib/pdf/generateCOI';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      certificateId,
      emails,
      certificateDate,
      certificateHolderName,
      certificateHolderAddress,
      additionalInsured,
      descriptionOfOperations,
    } = body;

    if (!certificateId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Missing certificateId or emails array' },
        { status: 400 }
      );
    }

    // Verify user owns this certificate (or admin)
    const { data: cert, error: fetchError } = await supabase
      .from('certificates')
      .select('*, client:clients(id)')
      .eq('id', certificateId)
      .single();

    if (fetchError || !cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (!cert.template_storage_path) {
      return NextResponse.json(
        { error: 'No template PDF has been uploaded for this certificate yet.' },
        { status: 422 }
      );
    }

    // Use admin client so we can access the storage bucket regardless of RLS
    const adminSupabase = await createAdminSupabaseClient();

    // Generate PDF in memory using the latest edited fields
    const { data: templateData, error: downloadError } = await adminSupabase.storage
      .from('coi-templates')
      .download(cert.template_storage_path);

    if (downloadError || !templateData) {
      throw new Error('Failed to load base PDF template');
    }

    const templateBytes = new Uint8Array(await templateData.arrayBuffer());

    const pdfBytes = await generateCOI({
      templateBytes,
      certificateDate: certificateDate || cert.certificate_date || cert.created_at.split('T')[0],
      certificateHolderName: certificateHolderName || cert.certificate_holder_name,
      certificateHolderAddress: certificateHolderAddress || cert.certificate_holder_address,
      additionalInsured: additionalInsured !== undefined ? additionalInsured : cert.additional_insured,
      descriptionOfOperations: descriptionOfOperations !== undefined ? descriptionOfOperations : cert.description_of_operations,
    });

    const pdfBuffer = Buffer.from(pdfBytes);

    // Verify transporter configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn("SMTP credentials are not configured in .env.local!");
      return NextResponse.json({ 
        error: 'SMTP not configured on the server. Please add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env.local' 
      }, { status: 500 });
    }

    // Setup Nodemailer transporter using env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Pre-written email template
    const subject = `Certificate of Liability Insurance - ${cert.certificate_number}`;
    const textMessage = `Hello,

Please find attached the Certificate of Liability Insurance (${cert.certificate_number}).

This certificate has been generated securely via The Ewing Agency Portal.

If you have any questions, please contact us.

Thank you,
The Ewing Agency`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0e2a47;">Certificate of Liability Insurance</h2>
        <p>Hello,</p>
        <p>Please find attached the Certificate of Liability Insurance <strong>(${cert.certificate_number})</strong>.</p>
        <p>This certificate has been generated securely via The Ewing Agency Portal.</p>
        <br />
        <p>If you have any questions, please contact us.</p>
        <p>Thank you,<br /><strong>The Ewing Agency</strong></p>
      </div>
    `;

    // Send email to all recipients
    const mailOptions = {
      from: `"The Ewing Agency" <${process.env.SMTP_USER}>`, // sender address
      to: emails.join(', '), // list of receivers
      subject: subject,
      text: textMessage,
      html: htmlMessage,
      attachments: [
        {
          filename: `COI-${cert.certificate_number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while sending email' },
      { status: 500 }
    );
  }
}
