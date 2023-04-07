from production_manager import ProductionManager
from time import sleep
import logging
logging.basicConfig(level=logging.INFO)

pm = ProductionManager([])  

pm.add_city("P51D1657TP10D4515")
print(pm.citylist)

input("waiting 2 ...")

# "id": 2467959,
# "name": "Kélibia",
# "state": "",
# "country": "TN",
# "coord": {
#     "lon": 11.09386,
#     "lat": 36.847569
# }