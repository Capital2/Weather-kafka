from cassandra.cluster import Cluster
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, MetaData, String, FLOAT, Table, DATETIME, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# schema for cleanData table
class CleanData(Base):
        __tablename__ = "cleanData" 
        id = Column(DATETIME, primary_key=True)
        temperature = Column(FLOAT)
        wind_speed = Column(FLOAT)
        humidity = Column(FLOAT)
        city_code = Column(String)
        city_name = Column(String)


class Analysis:
    def __init__(self):
        #init the database url
        self.url = 'mysql+mysqlconnector://root:root@localhost/weather'
        
        self.engine = create_engine(self.url, echo=True)
        self.connection = self.engine.connect()
        Session = sessionmaker(bind = self.engine)
        self.sqlSession = Session()
        
        self.metadata = MetaData()
        self.metadata.reflect(bind=self.connection)

        #open cassandra session
        self.cluster = Cluster(['localhost'])
        self.session = self.cluster.connect('weather')
        
       
    
    def get_data_from_cassandra(self,tableName:str):
        """
            select all rows from cassandra table
        """
        #get data from the table
        query = f"SELECT data FROM {tableName}"
        rows = self.session.execute(query)
        
        # Close connection
        self.session.shutdown()
        self.cluster.shutdown()
        
        return rows
    
    def clean_data(self, record:json)->dict:
        """
        return json contains temp, humidity, wind_speed, and datetime
        """
        #parse json data 
        json_data = json.loads(record)
        weather = json_data["weather"]
        value = json.loads(weather)

        return {
             "date_time": str(datetime.fromtimestamp(value["dt"])),
             "temperature": value["main"]["temp"],
             "wind_speed": value["wind"]["speed"],
             "humidity": value["main"]["humidity"],
             "city_name": value["name"]
        }
    
    def create_table(self):
        """
            create cleanData table
        """
        try:
            Table(
                "cleanData", self.metadata,
                Column('id',DATETIME, primary_key=True,),
                Column('temperature', FLOAT),
                Column('wind_speed', FLOAT),
                Column('humidity', FLOAT),
                Column('city_code',String),
                Column('city_name',String)
            )
            self.metadata.create_all(self.engine)
        except Exception as e :
            print(e)

    def insert_into_table(self, data:dict, code):
        """
            insert dict to sql table
        """
        self.sqlSession.merge(
            CleanData(
                id=data["date_time"],
                temperature=data["temperature"],
                wind_speed =data["wind_speed"],
                humidity= data["humidity"],
                city_code = code,
                city_name = data["city_name"]
            )
        )
        self.sqlSession.commit()

    def cassandra_to_sql(self, table_name: str) -> None:
        rows = self.get_data_from_cassandra(table_name)
        for row in rows:
            raw_data = self.clean_data(row.data)
            self.insert_into_table(raw_data, table_name)



analysis = Analysis()
analysis.cassandra_to_sql("P42D793TP0D4258")