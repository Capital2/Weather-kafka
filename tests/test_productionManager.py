import unittest
from mock import patch
from Producer.ProductionManager import ProductionManager as PM
class TestManager(unittest.TestCase):
    def setUp(self) -> None:
        return super().setUp()
    
    def test_PM_init(self):
        pm = PM("app/Producer/config.cfg")
