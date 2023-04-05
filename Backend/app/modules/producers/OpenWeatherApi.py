import urllib.parse
import requests
from api_exceptions import ApiServerException, LimitReachedException, ApiKeyNotWorkingException, MalformattedRequestException, ApiErrorException

import asyncio

from .CoordinatesEncoder import CoordinatesEncoder
from modules.notifications.controllers.alert_notifications import alert_notifications
from modules.notifications.controllers.subscriber_repository import subscriber_repository

class OpenWeatherApi:
    API_CALL_TYPES = {
        "weather" : "weather",
        "forecast" : "forecast",
        "onecall": "alerts"
    }

    def __init__(self, params: dict) -> None:
        self.url = f"https://api.openweathermap.org/data/2.5"
        self.params = params
        self.encrypted_city_coords = CoordinatesEncoder().encode(params['lat'], params['lon'])


    def get_all(self) -> dict:
        """
        {
            weather: weather,
            forecast: forecast,
            alerts: alerts
        }
        """
        data = {
            'topic_name' : self.encrypted_city_coords,
        }
        for call_type, value in self.API_CALL_TYPES.items():
            url = f"{self.url}/{call_type}?"
            response = self.get(url)
            data[value] = response.content.decode('utf-8')
            if value == "alerts":
                if 'alerts' in data[value]:
                    data[value] = data[value]['alerts']
                    alert = data[value][0] # only one alert is supported
                    asyncio.run(alert_notifications.send_email_to_subscribers(alert, self.encrypted_city_coords))
                    subscriber_repository.set_subscribers_sent(self.encrypted_city_coords) # to avoid sending the same alert twice
                else:
                    data[value] = "NO_DATA_FOUND"
                    subscriber_repository.set_subscribers_not_sent(self.encrypted_city_coords)
        return data


    def get(self, url: str) -> requests.Response:
        response = requests.get(url + urllib.parse.urlencode(self.params))
        if response.ok:
            return response

        if response.status_code == 404 :
            raise MalformattedRequestException()
        elif response.status_code == 401 :
            raise ApiKeyNotWorkingException()
        elif response.status_code == 429 :
            raise LimitReachedException()
        elif response.status_code in [500, 502, 503, 504]:
            raise ApiServerException()
        else:
            raise ApiErrorException()

if __name__ == '__main__':
    api = OpenWeatherApi()
    r = api.get()
    pass