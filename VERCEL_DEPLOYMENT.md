# TGSWC Warehouse Frontend — Deployment Guide (Vercel)

This guide explains how to deploy the React + Vite frontend on **Vercel** connected to the Spring Boot backend on **Render**.

---

## 1. Prerequisites
* GitHub repository connected to Vercel: `https://github.com/Vanshitha99/warehouse-forntend.git`.
* Deployed backend URL (e.g. `https://<your-backend-app>.onrender.com/api`).

---

## 2. Vercel Project Configuration

When importing the project in Vercel:

| Field | Recommended Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `.` (project root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 3. Environment Variables in Vercel

In the Vercel dashboard under **Project Settings -> Environment Variables**:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://<your-backend-app>.onrender.com/api` | URL of the deployed Spring Boot backend API |

*Note: For local development, `VITE_API_BASE_URL` automatically defaults to `http://localhost:8080/api` if unset.*

---

## 4. SPA Routing

The included `vercel.json` provides client-side single-page app (SPA) rewrite rules so that direct navigation to `/ja`, `/wm`, `/ta`, etc., works without 404 errors.
