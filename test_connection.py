from sqlalchemy import create_engine
from langchain_community.utilities import SQLDatabase
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

# Create connection string
connection_string = f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"

# Connect using LangChain's SQLDatabase
db = SQLDatabase.from_uri(connection_string)

# Test: print schema info
print("Connection successful!")
print(db.get_table_info())