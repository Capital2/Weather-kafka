from fastapi import status, HTTPException, Response
from .topics_manager import topics_manager
from ..exceptions.topics_exceptions import ExistantTopicName

class TopicsContoller():    
    def manage_subscriptions(self, lat: str, lon: str):                
        topic_name = "P36D847569TP11D09386"
        # try:
        #     topics_manager.add_topic(city_lat_long)
        #     return {"topic_name": city_lat_long }
        # except ExistantTopicName:
        #     return {"topic_name": city_lat_long }
        # except Exception:
        #     return {"error": True}       
        
        return {"topic_name": topic_name }
     
        

topics_controller = TopicsContoller()