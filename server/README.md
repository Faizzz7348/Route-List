# Server

This is the backend server for the Route-List application built with Node.js, Express.js, and TypeScript.

## Structure

```
server/
├── index.ts           # Main server entry point
├── middleware/        # Express middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/           # API route handlers
│   └── table.ts
└── lib/              # Utility libraries
    └── storage.ts    # In-memory data storage
```

## Features

- **Express.js** REST API server
- **TypeScript** with ES modules
- **Zod validation** for request/response validation
- **WebSocket support** for real-time updates
- **CORS configuration** for frontend integration
- **Session management** with express-session
- **Request logging** middleware
- **Error handling** with detailed validation messages
- **In-memory storage** with interface abstraction for future database integration

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Table Rows
- `GET /api/table/rows` - Get all rows
- `GET /api/table/rows/:id` - Get a specific row
- `POST /api/table/rows` - Create a new row
- `PUT /api/table/rows/:id` - Update a row
- `DELETE /api/table/rows/:id` - Delete a row
- `POST /api/table/rows/reorder` - Reorder rows

### Table Columns
- `GET /api/table/columns` - Get all columns
- `GET /api/table/columns/:id` - Get a specific column
- `POST /api/table/columns` - Create a new column
- `PUT /api/table/columns/:id` - Update a column
- `DELETE /api/table/columns/:id` - Delete a column
- `POST /api/table/columns/reorder` - Reorder columns

### Statistics
- `GET /api/table/stats` - Get table statistics

## Data Models

The server uses shared TypeScript schemas defined in `/shared/schema.ts` for data validation and type safety between frontend and backend.

## Development

The server runs on port 3000 by default and includes:
- Hot reload in development mode
- Request/response logging
- Detailed error messages
- CORS support for local development

## Production

In production mode, the server:
- Serves static files from `/dist/public`
- Uses secure session cookies
- Provides optimized error messages
- Serves the React SPA for all non-API routes