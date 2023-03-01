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
    from mock import patch
    import configparser
    import json
    from mock import patch

    # config = configparser.ConfigParser()
    # config.read("config.cfg")
    # keys = json.loads(config.get("Api","keys"))
    
    api = OpenWeatherApi(params = {
            'id': 2467959,
            'units': 'metric',
            'appid': 'keys[0]'
        })
    with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 500
            mock_resp.return_value.ok = False
            r = api.get()
            print(r)