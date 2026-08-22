# 🚀 HostelHub Production Deployment Guide

This guide walks you through deploying the **HostelHub** full-stack application:
- **Backend:** Render / Railway (Node.js + Express API)
- **Frontend:** Vercel / Netlify (React + Vite SPA)
- **Database & Storage:** Supabase (PostgreSQL + Auth + Storage Bucket)

---

## 📋 Table of Contents
1. [Step 1: Setup Supabase (Database & Storage)](#step-1-setup-supabase)
2. [Step 2: Deploy Backend (Render / Railway)](#step-2-deploy-backend)
3. [Step 3: Deploy Frontend (Vercel / Netlify)](#step-3-deploy-frontend)
4. [Step 4: Connect CORS & Allowed Origins](#step-4-connect-cors--allowed-origins)
5. [Step 5: Post-Deployment Verification](#step-5-post-deployment-verification)

---

## Step 1: Setup Supabase

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. **Execute Database Schema:**
   - Go to **SQL Editor** -> **New Query**.
   - Copy the entire SQL script from [`backend/migrations/001_initial_schema.sql`](./backend/migrations/001_initial_schema.sql).
   - Click **Run**. This creates all tables (`profiles`, `resources`, `cts`, etc.), RLS security policies, full-text indexes, and triggers.
3. **Setup Storage Bucket:**
   - Go to **Storage** -> **New Bucket**.
   - **Bucket Name:** `hostelhub-resources`
   - **Public bucket:** Enable (Checked ✅)
   - Save the bucket.
4. **Copy API Keys:**
   - Go to **Project Settings** -> **API**.
   - Copy **Project URL** (`https://xyz.supabase.co`).
   - Copy **anon public key**.
   - Copy **service_role secret key** (keep secret!).

---

## Step 2: Deploy Backend (Render.com)

1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/kartikvermagit-ds/HostelHub.git`.
4. Configure the Web Service:
   - **Name:** `hostelhub-backend` (or your preferred name)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Add Environment Variables:**
   Click **Add Environment Variable** and enter:
   ```env
   NODE_ENV=production
   PORT=10000
   API_PREFIX=/api/v1
   FRONTEND_URL=https://your-frontend-domain.vercel.app

   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_STORAGE_BUCKET=hostelhub-resources

   MAX_PDF_SIZE=20971520
   MAX_IMAGE_SIZE=10485760
   MAX_VIDEO_SIZE=104857600
   ```
6. Click **Create Web Service**.
7. Once deployed, note your backend URL:  
   👉 `https://hostelhub-backend.onrender.com`

---

## Step 3: Deploy Frontend (Vercel)

1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `HostelHub`.
4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit -> Select `frontend` -> Click **Continue**.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Add Environment Variables:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://hostelhub-backend.onrender.com/api/v1` *(Your Render backend URL + /api/v1)*
6. Click **Deploy**.
7. Once finished, note your frontend URL:  
   👉 `https://hostelhub.vercel.app`

---

## Step 4: Connect CORS & Allowed Origins

After getting your live Frontend URL from Vercel:

1. **Update Backend on Render:**
   - Go to your Render Backend Service -> **Environment**.
   - Update `FRONTEND_URL` to your exact Vercel URL (e.g. `https://hostelhub.vercel.app`).
   - Save changes (Render will automatically redeploy).
2. **Update Supabase Auth Redirect URLs:**
   - Go to **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
   - Set **Site URL** to `https://hostelhub.vercel.app`.
   - Add Redirect URLs: `https://hostelhub.vercel.app/**`.

---

## Step 5: Post-Deployment Verification

1. **Verify Backend Health:**
   Visit: `https://hostelhub-backend.onrender.com/api/v1/health`
   Expected response:
   ```json
   {
     "success": true,
     "message": "HostelHub API is running",
     "data": { "status": "UP", "service": "HostelHub API", "version": "1.0.0" }
   }
   ```

2. **Verify Frontend Application:**
   - Open `https://hostelhub.vercel.app/`.
   - Register a new account or sign in.
   - Upload a sample PDF study material.
   - Test bookmarking and CT Zone checklist.
