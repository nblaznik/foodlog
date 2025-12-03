# AI-Powered Food Log  
A lightweight nutrition-logging web app that runs entirely on GitHub Pages + Google Apps Script, with automatic AI parsing and Google Sheets storage.

This project lets you:
- type any natural-language description of what you ate  
- send it to a backend  
- automatically split it into multiple food items  
- estimate nutritional values via OpenAI  
- store each item as a separate row in Google Sheets  
- view synced history from the sheet on any device  
- use a clean, mobile-friendly frontend

The whole stack requires **no servers**, **no database setup**, and **no framework**.

---

## ✨ Features

### 🔍 AI Nutrition Parsing
You can write entries like:
"had pancakes, syrup, bacon and a cappuccino"

The system automatically:
- splits it into individual food items  
- infers realistic kcal, protein, carbs, fats  
- returns structured JSON  
- inserts all rows into your Google Sheet

### 🗂 Google Sheets as Your Database
All data is stored in:
Sheet1

Each row includes:
- date  
- time  
- meal (optional)  
- description  
- amount  
- kcal, protein, carbs, fats  

### 📱 Mobile-Optimized Frontend
The UI:
- is centered on desktop  
- expands to full-width on mobile  
- includes a clean textarea, submit button, and synced history  
- shows recent entries directly from your Google Sheet  
- allows clicking old entries to load them back into the editor  
- shows nice fading status messages ("OK ✓")

### 🌐 Zero Backend Hosting
Backend = Google Apps Script  
Frontend = GitHub Pages  
No servers. No containers. No databases to manage.

---

## 🚀 How It Works

### 1. User enters a food description  
Displayed on `index.html` hosted on GitHub Pages.

### 2. JavaScript sends the entry async to Google Apps Script  
The request is sent to:
https://script.google.com/macros/s/<your-deployment>/exec


### 3. Apps Script calls OpenAI  
The backend constructs a strict nutrition-parser prompt and sends it to:
https://api.openai.com/v1/chat/completions
(using your secret API key stored privately in Apps Script).

The AI returns JSON describing each food item.

### 4. Apps Script writes each item to Google Sheets  
One row per food.

### 5. The frontend fetches history with doGet  
`doGet` returns the latest N entries as JSON, which the frontend displays.

---

## 📦 File Structure

/
├── index.html # The entire frontend UI
└── README.md # This file


Backend exists in your Google Apps Script project.

---

## 🔧 Deployment Guide

### Step 1 — Google Sheet
Create a sheet with columns:

date | time | meal | description | amount | kcal | protein | carbs | fats


### Step 2 — Apps Script backend
Create a new script attached to the sheet.  
Add:
- `doPost` (handles submissions)  
- `doGet` (returns history)  
- `callOpenAI`, `extractJSON`, `getCurrentDate`, etc.

### Step 3 — Deploy as Web App  
**Execute as:** Me  
**Who has access:** Anyone  
Copy the `/exec` URL.

### Step 4 — GitHub Pages  
Publish this repo using GitHub Pages.  
Paste the endpoint URL into `ENDPOINT` inside `index.html`.

### Step 5 — Done  
You now have:
- AI food parsing  
- synced history  
- auto nutrition analysis  
- no servers to maintain  

---

## 🧠 Tech Stack

Frontend:
- HTML  
- CSS  
- Vanilla JavaScript  
- LocalStorage fallback

Backend:
- Google Apps Script  
- OpenAI API  
- Google Sheets as database  

Hosting:
- GitHub Pages  

---

## 🙌 Improvements You Can Add
- daily/weekly calorie summaries  
- charts (calories per day, macros breakdown)  
- meal categorization  
- barcode scanning (simple JS libraries exist)  
- PWA support (install as an app)  
- voice input for food entries  

---

## 📜 License
Free to use, modify, or build upon. Enjoy logging your meals!
