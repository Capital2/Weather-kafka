import configparser
import json

CONFIG_PATH = "config.cfg"

class ProduceFactory:
    """A singleton class that spawns kafka producers, brabbi instance barka chabeb be5el 3ala 7al ma5ir"""
    # https://stackoverflow.com/questions/31875/is-there-a-simple-elegant-way-to-define-singletons
    # might be relevant
    
    # max producers is max api keys
    def __init__(self) -> None:
        self.producers = []
        config = configparser.ConfigParser()
        config.read(CONFIG_PATH)
        self.keys = json.loads(config.get("Api","keys"))

    def factory_city_exists(self, cityid):
        pass
    
    def make_producer(self, ):
        pass