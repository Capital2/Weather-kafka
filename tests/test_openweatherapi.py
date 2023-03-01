import unittest
from mock import patch
from Producer.OpenWeatherApi import OpenWeatherApi
import requests
import Producer.api_exceptions as apiex

class TestApi(unittest.TestCase):

    def setUp(self) -> None:
        self.api = OpenWeatherApi({ 'test' : 'test'})

    def test_get_500(self):
        with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 500
            mock_resp.return_value.ok = False

            self.assertRaises(apiex.ApiServerException, self.api.get)
    
    def test_get_401(self):
        with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 401
            mock_resp.return_value.ok = False

            self.assertRaises(apiex.ApiKeyNotWorkingException, self.api.get)

    def test_get_any_ex(self):
        with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 100
            mock_resp.return_value.ok = False

            self.assertRaises(apiex.ApiErrorException, self.api.get)

    def test_get_404(self):
        with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 404
            mock_resp.return_value.ok = False

            self.assertRaises(apiex.MalformattedRequestException, self.api.get)

    def test_get_429(self):
        with patch("requests.get") as mock_resp:
            #creating the mock response
            mock_resp.return_value.status_code = 429
            mock_resp.return_value.ok = False

            self.assertRaises(apiex.LimitReachedException, self.api.get)

if __name__ == '__main__':
    unittest.main()