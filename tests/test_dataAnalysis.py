import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA

# Load the data
data = pd.read_csv('time_series_data.csv', index_col='Date', parse_dates=True)

# Plot the data
plt.plot(data)
plt.title('Time-Series Data')
plt.xlabel('Date')
plt.ylabel('Value')
plt.show()

# Fit an ARIMA model
model = ARIMA(data, order=(1, 1, 1))
results = model.fit()

# Make predictions for the next 7 days
forecast = results.predict(start=len(data), end=len(data)+6, typ='levels')

# Plot the forecast
plt.plot(data, label='Observed')
plt.plot(forecast, label='Forecast')
plt.title('Time-Series Forecast')
plt.xlabel('Date')
plt.ylabel('Value')
plt.legend()
plt.show()