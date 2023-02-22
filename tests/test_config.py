import unittest
from mock import patch
import configparser
import json
import os
class TestConfig(unittest.TestCase):

    def setUp(self) -> None:
        os.chdir(os.getcwd() + "/Producer")
        return super().setUp()

    def test_ini(self):
        config = configparser.ConfigParser()
        config.read("config.cfg")
        keys = json.loads(config.get("Api","keys"))
        self.assertIsInstance(keys, list, "Please provide a list of api keys")
        self.assertTrue(keys, "Please provide atleast one api key")