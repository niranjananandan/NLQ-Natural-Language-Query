# NLQ – Natural Language Query

An AI-powered Natural Language Query (NLQ) system that allows users to interact with a MySQL database using plain English instead of writing SQL queries manually.

The application uses Google Gemini to understand natural-language questions, generate SQL queries, execute them against a MySQL database, and return the results through a modern web interface.

---

## Live Demo

### Frontend

https://nlq-natural-language-query.vercel.app

### Backend API

https://nlq-natural-language-query.onrender.com

### API Documentation

https://nlq-natural-language-query.onrender.com/docs

---

## Overview

Traditional database systems require users to have SQL knowledge to retrieve information from structured data.

This project solves that problem by providing a Natural Language Query interface.

Instead of writing:

```sql
SELECT name, city
FROM customers
WHERE city = 'Chennai';
```

a user can simply ask:

> Show customers from Chennai

The system automatically understands the question, generates the required SQL query using Google Gemini, executes the query against the MySQL database, and displays the result through the web interface.

The generated SQL query is also displayed to the user, providing transparency into how the natural-language question was converted into SQL.

---

## Key Features

- Natural-language database querying
- AI-powered SQL generation using Google Gemini
- MySQL database integration
- FastAPI REST API backend
- React-based interactive frontend
- Vite development environment
- Tailwind CSS based user interface
- Database schema visualization
- Sample table data visualization
- Generated SQL display
- Query history
- Copy generated SQL functionality
- SQL safety validation
- CORS-enabled API
- Cloud deployment
- Responsive and modern user interface

---

## Architecture

The application follows a three-layer architecture consisting of the frontend, backend API, and database.

```text
                         User
                          |
                          v
                +-------------------+
                |   React Frontend  |
                |     (Vite)        |
                +---------+---------+
                          |
                          | HTTP REST API
                          v
                +-------------------+
                |   FastAPI Backend |
                +---------+---------+
                          |
              +-----------+-----------+
              |                       |
              v                       v
      +---------------+       +---------------+
      | Google Gemini |       | MySQL Database|
      |     LLM       |       |   (Railway)   |
      +---------------+       +---------------+
              |
              v
       Generated SQL
              |
              v
       SQL Validation
              |
              v
       Query Execution
              |
              v
            Result
              |
              v
        React Frontend
```

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Lucide React
- JavaScript

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Python-dotenv

### AI / LLM

- Google Gemini
- LangChain
- LangChain Community
- LangChain Classic
- LangChain Google GenAI

### Database

- MySQL
- PyMySQL
- SQLAlchemy

### Deployment

- Vercel – Frontend
- Render – Backend
- Railway – MySQL Database

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## Project Structure

```text
NLQ-Natural-Language-Query/
│
├── nlq-frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── nlq-logo.svg
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── main.py
├── nlq_chain.py
├── requirements.txt
├── test_connection.py
├── .gitignore
├── .env
└── README.md
```

---

## Backend API

The FastAPI backend provides REST API endpoints for interacting with the database.

### POST `/query`

Accepts a natural-language question and generates and executes the corresponding SQL query.

## Example Queries

Users can interact with the database using simple natural-language questions.

### Example 1

```text
Show all customers
```

Possible generated SQL:

```sql
SELECT * FROM customers;
```

---

### Example 2

```text
Show customers from Chennai
```

Possible generated SQL:

```sql
SELECT *
FROM customers
WHERE city = 'Chennai';
```

## Database

The project uses MySQL as its relational database.

The deployed database is hosted using Railway.

The demo database contains two main tables:

### Customers Table

| Column | Type | Description |
|---|---|---|
| customer_id | Integer | Unique customer identifier |
| name | String | Customer name |
| city | String | Customer city |
| signup_date | Date | Customer registration date |

### Orders Table

| Column | Type | Description |
|---|---|---|
| order_id | Integer | Unique order identifier |
| customer_id | Integer | Reference to the customer |
| product_name | String | Name of the ordered product |
| amount | Decimal | Order amount |
| order_date | Date | Date of the order |

### Database Relationship

```text
customers
    |
    | customer_id
    |
    v
orders.customer_id
```

The `orders.customer_id` column references `customers.customer_id`.

This relationship allows the NLQ system to generate queries involving multiple tables.

---

## Sample Database Data

### Customers

| customer_id | name | city | signup_date |
|---:|---|---|---|
| 1 | Arun | Coimbatore | 2024-01-15 |
| 2 | Divya | Chennai | 2024-02-20 |
| 3 | Karthik | Bangalore | 2024-03-10 |

### Orders

| order_id | customer_id | product_name | amount | order_date |
|---:|---:|---|---:|---|
| 1 | 1 | Laptop | 55000.00 | 2024-06-01 |
| 2 | 1 | Mouse | 500.00 | 2024-06-05 |
| 3 | 2 | Keyboard | 1200.00 | 2024-07-12 |
| 4 | 3 | Monitor | 8000.00 | 2024-08-20 |

---

## How It Works

The complete workflow of the system is:

```text
Natural Language Question
            |
            v
       React Frontend
            |
            v
        FastAPI API
            |
            v
    Database Schema
            |
            v
       Google Gemini
            |
            v
       Generated SQL
            |
            v
      SQL Validation
            |
            v
      MySQL Database
            |
            v
          Result
            |
            v
      React Frontend
```

## Deployment

The project uses a cloud deployment architecture consisting of three services.

### Frontend – Vercel

The React + Vite frontend is deployed on Vercel.

```text
React + Vite
      |
      v
   Vercel
```

Vercel configuration:

```text
Root Directory:
nlq-frontend

Build Command:
npm run build

Output Directory:
dist
```

---

### Backend – Render

The FastAPI backend is deployed on Render.

```text
FastAPI
   |
Uvicorn
   |
Render
```

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Production backend:

```text
https://nlq-natural-language-query.onrender.com
```

---

### Database – Railway

The MySQL database is hosted on Railway.

```text
       MySQL
          |
          v
       Railway
```

The database contains the project tables and provides the production database connection for the FastAPI backend.

---

## Complete Deployment Architecture

```text
                    INTERNET
                        |
                        v
              +------------------+
              |      Vercel      |
              | React Frontend   |
              +--------+---------+
                       |
                       | HTTPS
                       |
                       v
              +------------------+
              |      Render      |
              | FastAPI Backend  |
              +--------+---------+
                       |
                       | MySQL
                       |
                       v
              +------------------+
              |     Railway      |
              |  MySQL Database  |
              +------------------+

                       ^
                       |
              +------------------+
              |   Google Gemini  |
              |      LLM         |
              +------------------+
```

---

## Learning Outcomes

Through this project, the following concepts were explored and implemented:

### Artificial Intelligence

- Large Language Models
- Google Gemini API
- Natural Language Processing
- Natural Language Query systems
- Text-to-SQL generation

### Backend Development

- FastAPI
- REST API development
- API request and response handling
- Pydantic models
- CORS configuration
- Uvicorn server

### Database

- MySQL
- SQL queries
- SQL execution
- Database schema inspection
- Table relationships
- Foreign keys
- PyMySQL
- SQLAlchemy

### LangChain

- LangChain Community
- LangChain Classic
- LangChain Google GenAI
- SQL database utilities
- SQL query generation chains
- SQL database tools

### Frontend

- React
- React Hooks
- Vite
- Tailwind CSS
- API integration
- Async JavaScript
- State management
- Interactive UI components

### Deployment

- Git
- GitHub
- Vercel
- Render
- Railway
- Environment variable management
- Production API configuration

---

## License

This project is available for educational and portfolio purposes.


## Acknowledgements

This project was built using open-source technologies and developer tools including:

- React
- Vite
- Tailwind CSS
- FastAPI
- LangChain
- Google Gemini
- MySQL
- SQLAlchemy
- PyMySQL
- Vercel
- Render
- Railway

---

## Final Workflow

The complete application workflow can be summarized as:

```text
                    USER
                      |
                      v
          Natural Language Question
                      |
                      v
              React Frontend
                      |
                      v
              FastAPI Backend
                      |
          +-----------+-----------+
          |                       |
          v                       v
   Database Schema          Google Gemini
          |                       |
          +-----------+-----------+
                      |
                      v
                Generated SQL
                      |
                      v
              SQL Validation
                      |
                      v
                MySQL Database
                      |
                      v
                  Result
                      |
                      v
              React Frontend
                      |
                      v
                    USER
```

**NLQ – Natural Language Query** demonstrates how Large Language Models can make relational database interaction more accessible by allowing users to query structured data using natural language.