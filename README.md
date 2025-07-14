# 🖼️ ASCII Art Generator

Convert images to stunning ASCII art in seconds. Upload an image and get a text-based ASCII representation that you can copy, share, or download. Built with **Next.js 15**, **TailwindCSS**, **Jimp**, and more.

## ✨ Features

- 📤 Upload any image (JPG/PNG)
- 🧠 Automatically convert image to ASCII using `jimp`
- ⚙️ Adjustable grayscale rendering
- 🌗 Dark/Light theme support with `next-themes`
- 🔒 User auth via Clerk
- 🚀 Fast performance with optimized image processing (`sharp`)
- 📦 Serverless-ready and powered by `Neon` + `Drizzle ORM`
- ⏳ **Free tier**: Generate up to **3 ASCII arts/day**
- 💳 Subscribe to unlock **unlimited generation**

## 🔧 Tech Stack

| Tool             | Purpose                          |
|------------------|----------------------------------|
| **Next.js 15**   | React framework (App Router)     |
| **Tailwind CSS** | Utility-first styling            |
| **Jimp**         | Image to ASCII conversion        |
| **Sharp**        | Image optimization               |
| **Drizzle ORM**  | Type-safe DB access              |
| **Clerk**        | Authentication                   |
| **Neon**         | Serverless Postgres              |
| **Shadcn/UI**    | Beautiful UI components          |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sarcastic-Soul/ascii-art-saas.git
cd ascii-art-generator
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable
DATABASE_URL=your_neon_postgres_url
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend
```

### 4. Run the dev server

```bash
npm run dev
# or
yarn dev
```

App will be live at: [http://localhost:3000](http://localhost:3000)

## 🖼️ How It Works

1. Upload your image (client-side)
2. Image is resized and processed using `jimp`
3. Pixel brightness is mapped to ASCII characters
4. Result is rendered and copyable in the UI

## 📸 Example Output

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@######******##@@@@@@@@@@@@
@@@@@@@%*+=-:.      .:-=*#@@@@@@@@@
@@@@@#+-.               .:+%@@@@@@@
@@@@#=:                    -+%@@@@@
@@@@+:                     .-*@@@@@
```

## 🛠️ Scripts

```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"db:push": "drizzle-kit push"
```

## 📄 License

MIT © [Anish Kumar](https://github.com/Sarcastic-Soul)

---