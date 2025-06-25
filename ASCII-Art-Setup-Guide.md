# 🧾 ASCII Art SaaS - Dev & Production Setup Guide

This project uses Clerk for authentication and Drizzle + NeonDB for user and image storage. Webhooks from Clerk are used to sync users to your internal `users` table.

---

## 🛠️ Development Setup (Localhost)

Clerk webhooks require a **publicly accessible URL**, but localhost is not accessible from the internet. So:

### ✅ In Development:
- Webhooks **will not** work reliably on `localhost`.
- Instead, we manually insert the user into the database after signup.

### 🔧 What to Do:
1. After a successful signup and session activation (`setActive()`):
   - Send a POST request to your internal API to save the user to the database:

   ```ts
   await fetch("/api/register-user", {
     method: "POST",
     body: JSON.stringify({ id: completeSignup.createdUserId, email }),
   });
   ```

2. This route should insert the user into your `users` table:

   ```ts
   // app/api/register-user/route.ts
   import { db } from "@/db/drizzle";
   import { users } from "@/db/schema";

   export async function POST(req: Request) {
       const { id, email } = await req.json();
       await db.insert(users).values({ id, email, isSubscribed: false });
       return new Response("User inserted", { status: 200 });
   }
   ```

---

## 🚀 Production Setup

In production, you must use **Clerk webhooks** to automatically sync new users.

### ✅ Steps:
1. Deploy your app to a public server (e.g., Vercel).
2. Set up the webhook in the Clerk dashboard:

   **Webhook URL:**
   ```
   https://yourdomain.com/api/webhooks/user
   ```

3. Make sure `.env` includes your Clerk `WEBHOOK_SECRET`.

4. Your webhook handler (`/api/webhooks/user`) is already configured in:

   ```
   /app/api/webhooks/user/route.ts
   ```

   It verifies the Clerk signature and inserts the user into your `users` table.

---

## 🔁 Switching Between Dev and Prod

| Environment | Insert User Manually? | Webhook Required? |
|------------|------------------------|--------------------|
| Development (`localhost`) | ✅ Yes | ❌ No |
| Production (`yourdomain.com`) | ❌ No | ✅ Yes |

---

## 📦 Notes

- Don’t forget to turn off manual DB insert in production (comment out `fetch("/api/register-user")`)
- Webhooks will automatically keep user DB in sync

---

Happy hacking! 🐤💻