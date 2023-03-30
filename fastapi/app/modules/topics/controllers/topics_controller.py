from fastapi import status, HTTPException, Response
from .topics_manager import topics_manager
from ..exceptions.topics_exceptions import ExistantTopicName

class TopicsContoller():    
    def manage_subscriptions(self, city_lat_long: str):                
        try:
            topics_manager.add_topic(city_lat_long)
            return {"topic_name": city_lat_long }
        except ExistantTopicName:
            return {"topic_name": city_lat_long }
        except Exception:
            return {"error": True}        
        

topics_controller = TopicsContoller()