### GrowEasy AI CSV Importer ###

### An intelligent, AI-powered CSV extraction tool that seamlessly transforms chaotic, unstructured lead data into perfectly formatted CRM records.###

## 🌟 Overview

The **GrowEasy AI CSV Importer** solves the most frustrating problem in lead management: data ingestion. Instead of relying on rigid, column-dependent parsers that break when a header name changes, this application utilizes **Google Gemini AI** to contextually understand and map uploaded CSV data to precise CRM fields. 

Whether it's a Facebook Lead export, an Excel sheet from a real estate agency, or a manually typed sales report, the system intelligently extracts names, contacts, and statuses, mapping secondary data gracefully into notes—all while maintaining robust type-safety and data validation.

## ✨ Key Features

- **Intelligent AI Mapping:** Understands context and automatically maps ambiguous columns (e.g., "Phone No", "Contact", "Mob") to standardized CRM fields.
- **Robust Batch Processing:** Handles large datasets by chunking data and processing it efficiently without overwhelming the AI models or server limits.
- **Smart Data Resolution:** Intelligently combines secondary contact information (multiple emails/phones) into CRM notes so no data is ever lost.
- **Preview & Confirmation:** Offers users a clean, responsive data table to preview parsed rows before committing the import.
- **Resilient Validation:** Built with strict Zod schemas to ensure only high-quality data reaches your database.

---

## 🛠️ Tech Stack & Technologies

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Components:** Radix UI / Shadcn (for polished, accessible UI elements)
- **State Management:** React Hooks / Context

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Database:** SQLite (Easily swappable to PostgreSQL)
- **Language:** TypeScript

### 📦 Key Third-Party Modules
- `@google/generative-ai`: Core LLM integration (Gemini 2.5 Flash) for data extraction.
- `fast-csv`: Highly performant CSV parsing from memory buffers.
- `multer`: Middleware for handling multipart/form-data (file uploads).
- `zod`: TypeScript-first schema declaration and data validation.
- `express-rate-limit` & `helmet`: Security and traffic control.

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/CHETAN-PONUGOTI/AI_CSV_Mapping_Extractor
cd groweasy-ai-importer
```

### Backend

cd backend

npm install

# Setup Environment Variables
cp .env.example .env

# Backend/.env

PORT=8000
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_google_gemini_api_key_here"
NODE_ENV="development"

# Generate Prisma Client and Push Schema
npm run prisma:generate
npm run prisma:push

# Start the Backend Server
npm run dev


### Frontend 

cd frontend

# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env.local

# frontend/.env.local

NEXT_PUBLIC_API_URL= [ "https://ai-csv-mapping-extractor.onrender.com/api/v1" || "http://localhost:8000/api/v1"]

# Start the Frontend Development Server
npm run dev


### Docker Setup

For a frictionless, containerized deployment, use the provided Docker configuration.

*** Ensure Docker and Docker Compose are installed on your machine. ***

*** Ensure you have a .env file at the root of the project with your GEMINI_API_KEY. ***

# Run the following command from the root directory: 

docker-compose up --build -d


***Frontend: Accessible at http://localhost:3000***
***Backend: Accessible at http://localhost:8000***

# to stop the container

docker-compose down


### 🏗️ Architecture & Workflow ###

**Upload**: User drags and drops a CSV via the Next.js UI.
**Buffer & Parse**: The file is sent via FormData to the Express backend. Multer catches it in memory, and fast-csv parses it into raw JSON rows.
**Database Staging**: Rows are stored in the database with a PENDING status attached to an ImportBatch ID.
**AI Extraction**: Once confirmed by the user, the backend chunks the data and streams it to Google Gemini.
**Validation**: Gemini returns a structured JSON payload which is immediately verified against a strict Zod Schema.
**Delivery**: The frontend polls for batch completion and displays the final, sanitized CRM records.


### Live Deploy Link ### : https://ai-csv-mapping-extractor.vercel.app/


### Screenshots :

<img width="1920" height="905" alt="{51189E0A-DADA-4BDD-8806-1EB571105DEE}" src="https://github.com/user-attachments/assets/d25d31a7-1a18-4a57-9011-6e25d5674b8c" />



<img width="1920" height="914" alt="{C747ADF7-87C6-48CC-B2CD-5CC6E471D352}" src="https://github.com/user-attachments/assets/c47b8abe-388f-437d-ad68-6db8b9891fd2" />



<img width="1920" height="913" alt="{C0C5CC4F-084C-4299-9BD4-FCD3F591F4D1}" src="https://github.com/user-attachments/assets/94dcc793-a16f-4367-af90-f6cad663023f" />



<img width="1920" height="908" alt="{42E0FEDB-1A9A-4540-96D4-90A1EFBB498D}" src="https://github.com/user-attachments/assets/79ae066e-d569-4b69-89fe-202b7f92130a" />
