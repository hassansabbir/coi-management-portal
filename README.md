# Ewing Agency COI Management

The **Ewing Agency COI Management** platform is a modern, responsive web application built to streamline the generation, management, and distribution of Certificates of Insurance (COI), primarily ACORD 25 certificates.

The platform consists of a secure **Admin Portal** for managing clients and issuing certificates, and a **Client Portal** where insureds can view their active policies and download their dynamically stamped PDF certificates.

## Features

### Admin Portal
- **Dashboard Overview**: View high-level metrics of clients and active certificates.
- **Client Management**: Create, view, and delete client accounts securely.
- **Certificate Upload & Stamping**: Upload base ACORD 25 templates and automatically stamp them with dynamic client data (Insured Name, Date, Certificate Holder details, etc.) using `pdf-lib`.
- **Automated Email Notifications**: Automatically dispatch stamped certificates via email when issued.
- **Mobile Responsive UI**: A fully responsive interface to manage certificates on the go.

### Client Portal
- **Secure Access**: Clients can log in to their secure portal using magic links/OTP or passwords.
- **Document Viewing**: View active and historical certificates in a built-in PDF viewer.
- **Account Settings**: Clients can update their profile information and change passwords.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Authentication**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Manipulation**: [pdf-lib](https://pdf-lib.js.org/)

## Getting Started

### Prerequisites

You will need the following tools installed on your local machine:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

You will also need a **Supabase** account and project setup with the following buckets and tables.

#### Database Schema
Ensure your Supabase project includes the following tables:
- `user_profiles`
- `clients`
- `certificates`

#### Storage Buckets
Ensure you have created the following public buckets in Supabase Storage:
- `coi-templates`: Used by admins to upload the raw ACORD 25 templates.
- `generated-cois`: (Optional) Used if generated PDFs are cached.

### Environment Variables

Create a `.env.local` file in the root of your project and populate it with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd ewing-agency-coi-management
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/(admin)`: Routes and pages for the Admin Portal.
- `app/(auth)`: Authentication routes (Login, Verify OTP, etc.).
- `app/(portal)`: Routes and pages for the Client Portal.
- `app/api`: Serverless API routes (Supabase Edge functions equivalent).
- `app/actions`: Next.js Server Actions for secure database mutations.
- `components/`: Reusable React components (UI elements, layout components, and client-side page views).
- `lib/`: Utility libraries (Supabase client setups, Auth guards, PDF generation logic).

## PDF Processing (`lib/pdf/generateCOI.ts`)

The application dynamically processes ACORD 25 templates. When a certificate is viewed or generated, it retrieves the base template from the Supabase `coi-templates` bucket and uses `pdf-lib` to overlay the specific client and holder data directly onto the PDF at predetermined coordinate maps.

## Deployment

This project is configured and optimized for deployment on [Vercel](https://vercel.com/new). Make sure to define the Environment Variables in your Vercel project settings prior to building.

```bash
npx vercel --prod
```

## License

This project is private and intended solely for the use of the Ewing Agency.
