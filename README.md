# Medoh Doctor Invite Tool

This is a full-stack application simulating a doctor invite system that allows both single and bulk invite functionality. Doctors can enter a phone number manually or upload a CSV file to send multiple invites.

---

## Setup Instructions
### Install dependencies

```bash
npm install
```

---

### Create `.env.local` file

At the root of the project, create a file called `.env.local` with the following contents:

```bash
SUPABASE_URL=https://<your-supabase-project-url>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

* You can find these values inside your Supabase project under:
  **Settings → API → Project URL & anon public key**

---

### Setup Supabase Database

Inside your Supabase SQL editor, create the following table:

```sql
create table sent_links (
  id uuid primary key default uuid_generate_v4(),
  doctor_name text,
  phone_number text,
  referral_code text,
  sent_at timestamp default now()
);
```

This will store all invite information.

---

### 5️⃣ Run the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000/
```

---

## ✅ File Structure

```
/app
  /api
    /send-link
      route.ts           → API route for handling invite requests
    /lib
      supabaseClient.ts      → Supabase client initialization

  DoctorInvite.module.css → Styling using CSS Modules
  layout.tsx             → Layout file (App Router)
  page.tsx               → Entry page (Main frontend component)

/public
  (static assets)
/.env.local              → Environment variables for Supabase
/package.json
/tailwind.config.ts
/tsconfig.json
/README.md
```

---

## How It Works

* **Single Invite:**

  * Doctor enters their name and a phone number.
  * On submit, API generates a unique referral link and stores it in Supabase.

* **Bulk Invite:**

  * Doctor uploads a CSV file with multiple phone numbers.
  * Each phone number is processed individually.
  * For every number, API generates a referral link and stores it in Supabase.
  * Individual status for each record is displayed after processing.

* **CSV Format:**

```csv
phoneNumber
+11234567890
+11234567891
+11234567892
```

* **Modal Loader:**

  * Full-page loader is shown while bulk or single invite is being processed to improve user experience.

---

**Question:**

How would you improve this tool in a real production setting?

In a real production environment, I would restructure the application using atomic design principles to create reusable UI components such as buttons, form fields, loaders, and modals. Since this assignment was scoped as a single-page tool, I kept the component structure simple for clarity and focus. However, in a larger system, reusable and composable components would ensure scalability, maintainability, and consistency across multiple pages and features. This would also allow faster feature development as the same elements can be easily reused and extended across the platform.

Beyond architecture, I would integrate production-grade features such as real SMS delivery through providers like Twilio, robust phone number validation, detailed error logging, and user authentication using Supabase Auth. I would also implement role-based access for doctors, add analytics to track invite delivery status, improve accessibility (WCAG compliance), ensure full mobile responsiveness, and utilize deployment platforms like Vercel for efficient CI/CD workflows. These changes would make the system fully reliable, secure, and scalable for real-world usage.# Medoh_Assessment
