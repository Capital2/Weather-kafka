import urllib.parse
import requests
from api_exceptions import ApiServerException, LimitReachedException, ApiKeyNotWorkingException, MalformattedRequestException, ApiErrorException

class OpenWeatherApi:
    API_CALL_TYPES = {
        "weather" : "weather",
        "forecast" : "forecast",
        "onecall": "alerts"
    }

    def __init__(self, params: dict) -> None:
        self.url = f"https://api.openweathermap.org/data/2.5"
        self.params = params

    def get_all(self) -> dict:
        """
        {
            weather: weather,
            forecast: forecast,
            alerts: alerts
        }
        """
        data = {}
        for call_type, value in self.API_CALL_TYPES.items():
            url = f"{self.url}/{call_type}?"
            response = self.get(url)
            data[value] = response.content.decode('utf-8')
            if value == "alerts":
                if 'alerts' in data[value]:
                    data[value] = data[value]['alerts']
                else:
                    data[value] = "NO_DATA_FOUND"
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