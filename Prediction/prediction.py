from cassandra.cluster import Cluster
import pandas as pd
import json
from prophet import Prophet


# Connect to the Cassandra cluster and keyspace
cluster = Cluster(['localhost'])
session = cluster.connect('weather')

# Define the query to select data from the table
query = "SELECT data FROM kafkasink"

# Execute the query and retrieve the data
rows = session.execute(query)

# Create a list to store the extracted data
data = []

# Iterate over the rows and extract the desired values
for row in rows:
    # Parse the JSON string into a Python dictionary
    json_data = json.loads(row.data)
    # Extract the desired values from the dictionary
    dt = json_data['dt']
    temp = json_data['main']['temp']
    # Append the values to the data list
    data.append({'dt': pd.to_datetime(dt, unit='s'), 'temp': temp})

# Create a Pandas DataFrame from the data
df = pd.DataFrame(data)
df['dt'] = pd.DatetimeIndex(df["dt"])

df.columns = ['ds', 'y']
#training the model

m = Prophet(interval_width=0.95)
model = m.fit(df)

#forcast the temperature
future_temperature = m.make_future_dataframe(periods=3,freq='D')
forecast = m.predict(future_temperature)
print(forecast.tail())

# Close connection
session.shutdown()
cluster.shutdown()
