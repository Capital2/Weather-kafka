from cassandra.cluster import Cluster
import pandas as pd
import json

class Analytics:
    def __init__(self):
        self.cluster = Cluster(['localhost'])
        self.session = self.cluster.connect('weather')

    def get_data_from_cassandra(self,tableName):
        query = f"SELECT data FROM {tableName}"
        rows = self.session.execute(query)
        for row in rows:
            # Parse the JSON string into a Python dictionary
            json_data = json.loads(row.data)
            # Extract the desired values from the dictionary
            value = json_data["weather"]
            value = json.loads(value)
            print(value["main"]["temp"])

            break


anal = Analytics()
anal.get_data_from_cassandra("P36D847569TP11D09386")


# Iterate over the rows and extract the desired values
