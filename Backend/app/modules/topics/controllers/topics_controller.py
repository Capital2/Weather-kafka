from fastapi import status, HTTPException, Response
from .topics_manager import topics_manager
from ..exceptions.topics_exceptions import ExistantTopicName
from .connectors_manager import connectors_manager
from modules.producers.production_manager import production_manager
from modules.producers.CoordinatesEncoder import coordinates_encoder
from modules.analysis.controllers.analysis import Analysis
from modules.producers.notifications.controllers.subscriber_repository import subscriber_repository

class TopicsContoller():    
    def manage_subscriptions(self, lat: str, lon: str):   
        city_lat_long = coordinates_encoder.encode(float(lat), float(lon))
        tries = 10
        while tries > 0:
            try:
                topics_manager.add_topic(city_lat_long)
            except Exception as e:
                print("Exception occurred:", e)
                print("Exception class:", type(e).__name__)
                tries -= 1
                continue
            break
        try:
            connectors_manager.create_connector(city_lat_long, city_lat_long)
        except Exception as e:
            print("Exception occurred:", e)
            print("Exception class:", type(e).__name__)
            pass
        
        production_manager.add_city(city_lat_long)

        return {"topic_name": city_lat_long }

    def get_all_topics(self):
        return {"topics": topics_manager.list_topics()}
    
    def delete_topic(self, topic_name: str):
        try:
            topics_manager.delete_topic(topic_name)
            return {"topic_name": topic_name}
        except Exception:
            return {"error": True}
    
    def get_all_connectors(self):
        return {"connectors": connectors_manager.list_connectors()}
    

    def create_connector(self, connector_name: str, topic_name: str):
        try:
            connectors_manager.create_connector(connector_name, topic_name)
            return {"connectors" : connectors_manager.list_connectors()}
        except Exception as e:
            print("Exception occurred:", e)
            print("Exception class:", type(e).__name__)
            return {"error": e}
    
    def restart_connector(self, connector_name: str):
        try:
            connectors_manager.restart_connector(connector_name)
            return {"connector_name": connector_name}
        except Exception as e:
            return {"error": e}
        
    def delete_connector(self, connector_name: str):
        try:
            return {"connectors": connectors_manager.delete_connector(connector_name)}
        except Exception as e:
            return {"error": e}
    
    def cassandra_to_sql(self, table_name: str):
        try:
            Analysis().cassandra_to_sql(table_name)
            return {"table_name": table_name}
        except Exception as e:
            print("Exception occurred:", e)
            print("Exception class:", type(e).__name__)
            return {"error": e}
    
    def get_subscribers(self):
        return {"subscribers": subscriber_repository.get_subscribers()}
    
    def get_subscribers_by_city(self, city: str):
        return {
            "subscribers": subscriber_repository.get_subscribers_by_city(city)
        }

    def remove_subscriber(self, email: str, city: str):
        return {
            "subscribers": subscriber_repository.remove_subscriber(email, city)
        }
    
    def add_subscriber(self, email: str, city: str):
        return {
            "subscribers": subscriber_repository.add_subscriber(email, city)
        }
    
topics_controller = TopicsContoller()