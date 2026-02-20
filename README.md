# Enlightened Research Institute (ERI) Portal

A premium Overseas Education Consultancy Portal built with Next.js 14, Firebase, and Tailwind CSS. Featuring a luxury academic design, AI course finder, student document vault, and an advanced admin CRM with analytics.

## 🚀 How to Run the Project

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 2. Setup
Clone the repository (if applicable) and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
The project is configured for **Demo Mode** by default. To use real Firebase features, update the values in `.env.local`:
```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
...
```

### 4. Run Development Server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
To verify the production build:
```bash
npm run build
npm run start
```

## 🔑 Demo Credentials

### Admin Portal
- **URL**: `/admin`
- **Email**: `admin@enlightened.com`
- **Password**: `ERI_Admin_2026`

### Student Portal
- **URL**: `/auth`
- You can register as a student or use existing local storage profiles.

## ✨ Features
- **Public Portal**: Hero section, dynamic countries grid, AI course finder, lead form.
- **Saathi AI Counselor**: An enterprise-grade AI assistant capable of handling complex education consultancy queries in English and Nepali.
- **Student Dashboard**: Document vault for uploading Passports and Transcripts.
- **Admin Dashboard**: Pipeline CRM, Recharts Analytics, and Notification system.
- **Luxury UI**: Highly animated with Framer Motion, 4K responsive.

## 🤖 Saathi AI Counselor
Saathi (साथी) is the core intelligence of the ERI Portal.
- **Multilingual**: Fluent in English, Romanized Nepali, and Mixed "Hinglish" style.
- **Expertise**: Deep knowledge of visa policies, tuition fees, and admission requirements for Australia, UK, USA, and Canada.
- **Intelligent Reasoning**: Analyzes student profiles to provide personalized academic roadmaps.
- **Automated**: Powered by Google Gemini 1.5 with a sophisticated consultancy-specific system prompt.

## 🛠️ Tech Stack
- **AI Engine**: Google Gemini 1.5 (via `@google/generative-ai`)
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS + Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Firebase (with Demo fallback)
