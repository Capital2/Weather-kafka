# https://pypi.org/project/pykafka/
import configparser
import json
from kafka import KafkaProducer
from OpenWeatherApi import OpenWeatherApi

producer = KafkaProducer(bootstrap_servers='0.0.0.0:9092')
config = configparser.ConfigParser()

for i in range(0,1000):
        
    jsonpaylode = {
        "hello": f"3asbaaaaa{i}"
    }
    jsonpaylode = json.dumps(jsonpaylode, indent=2).encode('utf-8')
    producer.send('2467959', jsonpaylode) # topic name is greetings
producer.close()