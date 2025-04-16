# Ladder - Government Bill Browser

A web application that allows the general public to view, browse, and interact with government bills and gazettes by providing summaries and answering questions about them.

## Features

- Browse a paginated list of government bills
- View bill PDFs in an embedded viewer
- Chat with an AI model to ask questions about bills
- Responsive design for all device sizes

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **PDF Viewer**: react-pdf
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ladder-web-dev
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your database connection string.

4. Set up the database
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed the database with sample bills
   npm run prisma:seed
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses three main models:

- `User`: For potential future authentication
- `Bill`: Represents government bills with title, publication date, and PDF URL
- `ChatMessage`: Stores chat messages related to bills

## API Endpoints

- `POST /api/chat`: Processes queries about bills
  - Request body: `{ bill_id: string, query: string }`
  - Response: `{ response: string }`

## License

[MIT](LICENSE)
