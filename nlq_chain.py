from langchain_community.tools import QuerySQLDataBaseTool
from langchain_community.utilities import SQLDatabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import create_sql_query_chain
from dotenv import load_dotenv
import os

load_dotenv()

db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

connection_string = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"
db = SQLDatabase.from_uri(connection_string)

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0
)

chain = create_sql_query_chain(llm, db)

question = "How many customers made purchases over 1000?"
sql_query = chain.invoke({"question": question})

print("Generated SQL:")
print(sql_query)


execute_query = QuerySQLDataBaseTool(db=db)

if "SQLQuery:" in sql_query:
    sql_query = sql_query.split("SQLQuery:")[1].strip()

result = execute_query.invoke(sql_query)

print("\nQuery Result:")
print(result)