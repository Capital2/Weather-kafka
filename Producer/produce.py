# https://pypi.org/project/pykafka/
import configparser
import json
from kafka import KafkaProducer
from OpenWeatherApi import OpenWeatherApi

# for kelibia


producer = KafkaProducer(bootstrap_servers='0.0.0.0:9092')
config = configparser.ConfigParser()

# load from config.ini
config.read("config.cfg")
keys = json.loads(config.get("Api","keys"))

api = OpenWeatherApi(params = {
            'id': 2467959,
            'units': 'metric',
            'appid': keys[0]
        })

r = api.get()

producer.send('greetings', b'hello') # topic name is greetings
producer.close()