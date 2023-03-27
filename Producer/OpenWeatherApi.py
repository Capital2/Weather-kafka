import urllib.parse
import requests
from api_exceptions import ApiServerException, LimitReachedException, ApiKeyNotWorkingException, MalformattedRequestException, ApiErrorException

class OpenWeatherApi:
    def __init__(self, params) -> None:
        self.url = "https://api.openweathermap.org/data/2.5/weather?"
        self.params = params
    
    def get(self) -> requests.Response:
        response = requests.get(self.url + urllib.parse.urlencode(self.params))
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