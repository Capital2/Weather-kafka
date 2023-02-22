class MalformattedRequestException(Exception):
    """"error code 404"""
    def __init__(self,message="404: wrong city name, ZIP-code or city ID, or the format of your API request is incorrect. please review it and check for any mistakes"):
        self.message = message
        super().__init__(self.message)

class ApiKeyNotWorkingException(Exception):
    """"Error code 401"""
    def __init__(self,message="401: You did not specify your API key or Your API key is not activated yet or You are using wrong API key in API request."):
        self.message = message
        super().__init__(self.message)

class LimitReachedException(Exception):
    """Error code 429"""
    def __init__(self,message="429: You surpassed the limit of your subscription"):
        self.message = message
        super().__init__(self.message)

class ApiServerException(Exception):
    """Error code 500 502 503 504"""
    def __init__(self,message="Internal Api server error, not my problem mate"):
        self.message = message
        super().__init__(self.message)

class ApiErrorException(Exception):
    def __init__(self,message="idk man, I think you fucked up"):
        self.message = message
        super().__init__(self.message)


if __name__ == '__main__':
    raise ApiServerException()

