# Setup Guide

## Prerequisites

1. Node.js 16+
2. Supabase account
3. ImageKit account

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:

   ```
   cd backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the backend directory:

   ```
   cp .env.example .env
   ```

2. Fill in the required environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `IMAGEKIT_PUBLIC_KEY` - Your ImageKit public key
   - `IMAGEKIT_PRIVATE_KEY` - Your ImageKit private key
   - `IMAGEKIT_URL_ENDPOINT` - Your ImageKit URL endpoint

## Database Setup

1. Run the database migrations:
   ```
   node runMigrations.js
   ```

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## Testing the API

```
npm test
```

## Cleaning Up Old Videos

```
npm run cleanup
```

The application will be available at `http://localhost:3000` by default.
