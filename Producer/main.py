from production_manager import ProductionManager
from time import sleep
import logging
logging.basicConfig(level=logging.INFO)

pm = ProductionManager([])

input("waiting 1 ..")

pm.add_city(2467959)

input("waiting 2 ...")

while True:

    print("prod")
    sleep(1)
    pass