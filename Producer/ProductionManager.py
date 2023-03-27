import configparser
import json
import Producer
from multiprocessing import Process
import os

class ProductionManager:
    """A singleton class that spawns kafka producers and manages them, brabbi instance barka chabeb be5el 3ala 7al ma5ir"""
    # https://stackoverflow.com/questions/31875/is-there-a-simple-elegant-way-to-define-singletons
    # might be relevant
    
    def __init__(self, config_path = "config.cfg") -> None:
        config = configparser.ConfigParser()
        if not os.path.exists(config_path):
            raise ValueError(f"the file path provided {config_path} could not be resolved")
        config.read(config_path)
        keys = json.loads(config.get("Api","keys"))
        # a table of producers
        self.producers = [Producer.Producer(key, [2467959]) for key in keys]
        if not self.producers:
            raise ValueError("Please provide at least one Api key in the configuration file")
        # producer processes
        self.processes = [Process(target=prod.produce) for prod in self.producers]
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

    def __del__(self):
        if self.processes:
            for proc in self.processes:
                proc.close()