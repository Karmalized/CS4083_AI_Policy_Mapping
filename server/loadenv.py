from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path('.')/'..'/'.env' #Obtain the .env file from the parent directory
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("US_API_KEY")