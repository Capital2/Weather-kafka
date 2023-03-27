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
    def __init__(self, apikey, cityidlist, timeout=2.5) -> None:
        self.calls = 0
        self.timeout = timeout
        self.apikey = apikey
        self.cityidlist = [] if cityidlist == None else cityidlist
        self.producer = KafkaProducer(bootstrap_servers=BOOTSTRAP_SERVER)


    def city_exists(self, cityid) -> bool:
        """checks whether the provided city topic is being produced to"""
        return cityid in self.cityidlist
    
    def produce(self):
        """Produces. Not tested"""
        try :
            # main producing loop
            while True:
                for cityid in self.cityidlist:
                    api = OpenWeatherApi(params = {
                        'id': cityid,
                        'units': 'metric',
                        'appid': self.apikey
                    })
                    jsonpaylode = api.get()
                    self.calls += 1

                    # jsonpaylode = json.dumps(jsonpaylode, indent=2).encode('utf-8')
                    # make it async
                    self.producer.send(str(cityid), jsonpaylode.content)

                time.sleep(self.timeout)
        except KeyboardInterrupt :
            print('bye')

if __name__ == '__main__':
    prod = Producer("db1ac472d1dd9cf2d4cd31a077113ee9", [2467959])
    prod.produce()