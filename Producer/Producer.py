from kafka import KafkaProducer
from OpenWeatherApi import OpenWeatherApi
import json
import time
# read from config maybe
BOOTSTRAP_SERVER = '0.0.0.0:9092'

class Producer:
    """A kafka prodcuer
        calls is an auto incremented variable that tracks the number of api calls.
        timeout is the timeout in between calls of the same city"""
    def __init__(self, apikey, timeout=2500) -> None:
        self.calls = 0
        self.timeout = timeout
        self.apikey = apikey
        self.cityidlist = None

    def city_exists(self):
        pass
    
    def produce(self, cityidlist):
        """Produces."""
        self.cityidlist = cityidlist
        producer = KafkaProducer(bootstrap_servers=BOOTSTRAP_SERVER)

        try :
            # main producing loop
            while True:
                for cityid in cityidlist:
                    api = OpenWeatherApi(params = {
                        'id': cityid,
                        'units': 'metric',
                        'appid': self.apikey
                    })
                    jsonpaylode = api.get()
                    self.calls += 1

                    jsonpaylode = json.dumps(jsonpaylode, indent=2).encode('utf-8')
                    # 
                    producer.send(cityid, jsonpaylode)

                time.sleep(self.timeout)
        except KeyboardInterrupt :
            print('bye')