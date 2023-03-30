class ExistantTopicName(Exception):
    def __init__(self, message, error_code = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)
        
        
class AddTopicError(Exception):
    def __init__(self, message, error_code = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

        

        
