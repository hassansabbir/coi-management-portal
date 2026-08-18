/**
 * POST /api/portal/certificate/send
 *
 * STUB — Email delivery not yet implemented.
 * This route is ready to be wired up once an email provider
 * (Resend, SendGrid, etc.) and final approval are in place.
 *
 * When implemented, this should:
 *   1. Call generateCOI() the same way as the preview route
 *   2. Upload the generated PDF to the 'coi-generated' bucket
 *   3. Send the PDF as an email attachment to the recipient
 *   4. Insert/update a coi_submissions row (status: 'sent', sent_at: now())
 */
export async function POST() {
  return Response.json(
    {
      error: 'Email delivery is not yet configured. Please contact the administrator.',
      stub: true,
    },
    { status: 501 }
  );
}
