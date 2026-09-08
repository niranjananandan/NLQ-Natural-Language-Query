from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.utilities import SQLDatabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import create_sql_query_chain
from langchain_community.tools import QuerySQLDataBaseTool
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

# DB connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

db_port = os.getenv("DB_PORT", "3306")
connection_string = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
db = SQLDatabase.from_uri(connection_string)

# LLM setup
llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0
)

# Chain setup
chain = create_sql_query_chain(llm, db)
execute_query = QuerySQLDataBaseTool(db=db)

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Request format
class QueryRequest(BaseModel):
    question: str

# Dangerous keywords list (safety)
DANGEROUS_KEYWORDS = ["DELETE", "DROP", "UPDATE", "INSERT", "ALTER", "TRUNCATE"]

@app.post("/query")
async def process_query(request: QueryRequest):
    try:
        # Step 1: Generate SQL
        sql_query = chain.invoke({"question": request.question})

        # Clean "SQLQuery:" prefix if present
        if "SQLQuery:" in sql_query:
            sql_query = sql_query.split("SQLQuery:")[1].strip()

        # Step 2: Safety check
        if any(keyword in sql_query.upper() for keyword in DANGEROUS_KEYWORDS):
            raise HTTPException(status_code=400, detail="Unsafe query detected. Only SELECT queries are allowed.")

        # Step 3: Execute
        result = execute_query.invoke(sql_query)

        return {
            "status": "success",
            "question": request.question,
            "generated_sql": sql_query,
            "result": result
        }


    except HTTPException:
        raise
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    
@app.get("/schema")
async def get_schema():
    try:
        tables = db.get_usable_table_names()
        schema_info = []
        for table in tables:
            columns_info = db.run(f"DESCRIBE {table}")
            schema_info.append({"table": table, "columns": columns_info})
        return {"status": "success", "tables": schema_info}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    
@app.get("/table-data/{table_name}")
async def get_table_data(table_name: str):
    try:
        allowed_tables = db.get_usable_table_names()
        if table_name not in allowed_tables:
            return {"status": "error", "message": "Table not found"}
        
        rows = db.run(f"SELECT * FROM {table_name} LIMIT 20")
        return {"status": "success", "rows": rows}
    except Exception as e:
        return {"status": "error", "message": str(e)}