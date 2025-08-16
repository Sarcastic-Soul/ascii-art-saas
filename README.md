# 🖼️ ASCII Art Generator

Convert images to stunning ASCII art in seconds. Upload an image and get a text-based ASCII representation that you can copy, share, or download. Built with **Next.js 15**, **TailwindCSS**, **Sharp**, and more.

![preview](./public/ascii-art.png)

## ✨ Features

- 📤 Upload any image (JPG/PNG)
- 🧠 Automatically convert image to ASCII using `sharp`
- ⚙️ Adjustable grayscale rendering with custom character sets
- 📐 Height and width control for precise sizing
- 👁️ Live preview before saving
- 📋 Copy ASCII art to clipboard
- 💾 Download ASCII art as text file
- 🔗 Share ASCII art functionality
- 🎨 Matrix-style neon theme with Lucide icons
- 🌗 Dark/Light theme support with `next-themes`
- 🔒 User authentication via Clerk
- 🚀 Fast performance with optimized image processing (`sharp`)
- 📦 Serverless-ready and powered by `Neon` + `Drizzle ORM`
- ⏳ **Free tier**: Generate up to **5 ASCII arts/day**
- 💳 Subscribe to unlock **unlimited generation**

## 🔧 Tech Stack

| Tool             | Purpose                          |
|------------------|----------------------------------|
| **Next.js 15**   | React framework (App Router)     |
| **Tailwind CSS** | Utility-first styling            |
| **Sharp**        | Image processing & ASCII conversion |
| **Lucide React** | Beautiful icon library           |
| **Drizzle ORM**  | Type-safe DB access              |
| **Clerk**        | Authentication & user management  |
| **Neon**         | Serverless Postgres database     |
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

Create a `.env.local` file in your root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Optional: For development
NODE_ENV=development
```

### 4. Set up the database

Run the database migrations:

```bash
npx drizzle-kit push
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

App will be live at: [http://localhost:3000](http://localhost:3000)

## 🖼️ How It Works

1. **Upload** your image (client-side processing)
2. **Customize** width, height, and character set for your ASCII art
3. **Preview** your ASCII art before saving (no credits used)
4. **Save** to your account or use copy/download/share buttons
5. **Process** - Image is resized and processed using `sharp`
6. **Convert** - Pixel brightness is mapped to ASCII characters
7. **Share** - Result is rendered with interactive buttons for easy sharing

## 🎨 Matrix Theme

The application features a cyberpunk matrix-inspired design with:
- 🟢 Green neon color scheme (`#00ff00` variants)
- ⚫ Deep black backgrounds for contrast
- ✨ Glowing effects and backdrop blur
- 🔤 Monospace fonts for that terminal feel
- 🎯 Lucide React icons for modern aesthetics

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

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit push     # Push schema to database
npx drizzle-kit studio   # Open Drizzle Studio

# Other
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production:
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key  
- `DATABASE_URL` - Your production database URL
- `NODE_ENV=production`

## 🎨 Customization

### Matrix Theme Colors:
- Primary: `#00ff00` (Bright green)
- Secondary: `#22c55e` (Green-500)
- Background: `#000000` (Pure black)
- Accents: Various green shades with opacity

### Character Sets:
Default: `@%#*+=-:. ` (dark to light)
Custom options: `█▉▊▋▌▍▎▏ ` or `●◐◑◒◓◔◕○ `

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT © [Anish Kumar](https://github.com/Sarcastic-Soul)

---