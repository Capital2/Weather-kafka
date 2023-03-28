import configparser
import json
# import Producer
from multiprocessing import Process, Manager
import os
from OpenWeatherApi import OpenWeatherApi
from time import sleep
from kafka import KafkaProducer

class ProductionManager:
    """A singleton class that spawns kafka producers and manages them, 
    brabbi instance barka chabeb be5el 3ala 7al ma5ir"""
    # TODO: scrap Producer.py, multiprocesssing sucks with classes
    # https://stackoverflow.com/questions/31875/is-there-a-simple-elegant-way-to-define-singletons
    # might be relevant
    
    def __init__(self, citylist: list, config_path = "config.cfg", bootstrap_server='0.0.0.0:9092') -> None:
        config = configparser.ConfigParser()
        if not os.path.exists(config_path):
            raise ValueError(f"the file path provided {config_path} could not be resolved")
        self.timeout = 2.5
        config.read(config_path)
        keys = json.loads(config.get("Api","keys"))
        # a table of producers
        self.citylist = Manager().list(citylist)

        if not keys:
            raise ValueError("Please provide at least one Api key in the configuration file")
        # producer processes
        self.processes = [Process(target=self._produce, args=(key, self.citylist, 0, bootstrap_server)) for key in keys]
        for proc in self.processes:
            proc.start()


    def city_exists(self, cityid) -> int :
        """checks if a producer is producing to that cityid topic, returns the index of that producer, -1 if not found"""
        for i in range(len(self.producers)):
            if self.producers[i].city_exists(cityid):
                return i
        return -1
    
    def add_city(self, cityid):
        """adds a city to the producers pool"""
        # when adding a city we need to preserve some kind of balance, we check for the one that has the
        # lowest num of cities
        if self.city_exists(cityid):
            return
        lowest = self.producers[0]
        for prod in self.producers:
            if len(lowest.cityidlist) <  len(prod.cityidlist):
                lowest = prod
        lowest.cityidlist.append(cityid)
    
    def _produce(self, apikey: str, cityidlist: list, calls = 0, bootstrap_server='0.0.0.0:9092'):
        """production loop"""
        try :
            producer = KafkaProducer(bootstrap_servers=bootstrap_server)
            # main producing loop
            while True:
                for cityid in cityidlist:
                    api = OpenWeatherApi(params = {
                        'id': cityid,
                        'units': 'metric',
                        'appid': apikey
                    })
                    jsonpaylode = api.get()
                    calls += 1

                    # jsonpaylode = json.dumps(jsonpaylode, indent=2).encode('utf-8')
                    # make it async
                    producer.send(str(cityid), jsonpaylode.content)

                print('producing...')
                sleep(self.timeout)
        except KeyboardInterrupt :
            print('bye')

    def __del__(self):
        if self.processes:
            for proc in self.processes:
                proc.close()