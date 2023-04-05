from pydantic import BaseSettings

from dotenv import load_dotenv
load_dotenv()




class Settings(BaseSettings):
    kafka_broker_ip: str
    kafka_broker_port: str

settings = Settings()