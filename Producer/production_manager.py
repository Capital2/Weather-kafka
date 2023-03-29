import configparser
import json
import logging
from multiprocessing import Process, Manager
import os
from OpenWeatherApi import OpenWeatherApi
from time import sleep
from kafka import KafkaProducer, errors
from api_exceptions import ApiKeyNotWorkingException, LimitReachedException
class ProductionManager:
    """
    A singleton class that spawns kafka producers and manages them, 
    brabbi instance barka chabeb be5el 3ala 7al ma5ir rahi singleton

        properties:
            citylist: list of cityids currently being produced to
            timeout: time in seconds between each city update

    """
    
    def __init__(self, citylist: list, config_path = "config.cfg", bootstrap_server='0.0.0.0:9092', timeout=2.5) -> None:
        """Args:
            citylist: Initial list of ints representing cityids to produce to
            config_path: path to configuration file
            bootstrap_server: kafka server ip
            timeout: time in seconds between each city update

        Raises:
            ValueError: if the config file is empty"""
        self.timeout = timeout
        config = configparser.ConfigParser()
        if not os.path.exists(config_path):
            raise ValueError(f"the file path provided {config_path} could not be resolved")
        config.read(config_path)
        keys = json.loads(config.get("Api","keys"))

        # every process has a list of cities that produces for them
        # manager.list is a proxy list that enables us to exchange data from and to subprocesses 
        # (dict.fromkeys removes duplicates)
        self._procinfo = [Manager().list() for k in keys]
        self.add_list_city(list(dict.fromkeys(citylist)))

        if not keys:
            raise ValueError("Please provide at least one Api key in the configuration file")
        # every process produces to a sublist of cities balanced by the add_city class method
        self._processes = [Process(target=self._produce, args=(keys[i], self._procinfo[i], i, 0, bootstrap_server)) for i in range(len(keys))]
        for proc in self._processes:
            proc.start()
    
    @property
    def citylist(self):
        return [city for listcity in self._procinfo for city in listcity] # naaref kizebi ama b5elt

    @citylist.setter
    def citylist(self, value):
        print("wow this call is useless")


    def city_exists(self, cityid) -> bool :
        """checks if a producer is producing to that cityid topic"""
        for proc in self._procinfo:
            if cityid in proc :
                return True
        return False
    
    def add_city(self, cityid):
        """adds a city to the producers pool"""
        # when adding a city we need to preserve some kind of balance, we check for the one that has the
        # lowest num of cities
        if self.city_exists(cityid):
            return
        lowest = self._procinfo[0]
        for prod in self._procinfo:
            if len(lowest) >  len(prod):
                lowest = prod
        lowest.append(cityid)
    
    def add_list_city(self, cityidlist : list):
        for item in cityidlist:
            self.add_city(item)
    
    def delete_city(self, cityid):
        pass
        # TODO
    
    def _produce(self, apikey: str, cityidlist: list, index, calls = 0, bootstrap_server='0.0.0.0:9092'):
        """production loop used for multiprocessing"""
        logging.info(f"process {os.getpid()} with {index=} started producing")
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
                    try:
                        jsonpaylode = api.get()
                    except (LimitReachedException, ApiKeyNotWorkingException) as e:
                        logging.error(f"process {os.getpid()} with {index=} has an api key {apikey} that is not working or a limit might be reached \
                                      offloading to other processes")
                        # TODO: implement offloading algos

                    calls += 1
                    try:
                        producer.send(str(cityid), jsonpaylode.content)
                    except errors.KafkaTimeoutError as e:
                        logging.error(f"KafkaTimeoutError raised, from process {os.getpid()} with {index=}\
                                      while pushing to topic {cityid}")
                sleep(self.timeout)
        except Exception as e :
            logging.exception(f"{os.getpid()} with {index=} exited")

    def __del__(self):
        if self._processes:
            for proc in self._processes:
                proc.close()
                logging.info(f"process {proc.pid} exited gracefully")