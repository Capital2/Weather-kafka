# https://pypi.org/project/pykafka/
import configparser
import json
from kafka import KafkaProducer
from OpenWeatherApi import OpenWeatherApi

producer = KafkaProducer(bootstrap_servers='0.0.0.0:9092')
config = configparser.ConfigParser()

jsonpaylode = {
    "hello": "3asbaaaaaa"
}
"""
# load from config.ini
config.read("config.cfg")
keys = json.loads(config.get("Api","keys"))

api = OpenWeatherApi(params = {
            'id': 2467959,
            'units': 'metric',
            'appid': keys[0]
        })

r = api.get()
"""
jsonpaylode = json.dumps(jsonpaylode, indent=2).encode('utf-8')
producer.send('greetings', jsonpaylode) # topic name is greetings
producer.close()