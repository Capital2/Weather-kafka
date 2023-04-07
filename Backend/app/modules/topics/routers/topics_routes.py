from fastapi import APIRouter
from ..controllers.topics_controller import topics_controller

router = APIRouter(
    prefix='/topics',
    tags=['Topics']
)


@router.get("/manage_subscription", response_model=dict)
async def manage_subscriptions(lat: str, lon: str):
    return topics_controller.manage_subscriptions(lat, lon)

@router.get("/get_all_topics", response_model=dict)
async def get_all_topics():
    return topics_controller.get_all_topics()

@router.delete("/delete_topic", response_model=dict)
async def delete_topic(topic_name: str):
    return topics_controller.delete_topic(topic_name)

@router.get("/get_all_connectors", response_model=dict)
async def get_all_connectors():
    return topics_controller.get_all_connectors()

@router.post("/create_connector", response_model=dict)
async def create_connector(request: dict):
    connector_name = request["connector_name"]
    topic_name = request["topic_name"]
    return topics_controller.create_connector(connector_name, topic_name)
    

@router.put("/restart_connector", response_model=dict)
async def restart_connector(connector_name: str):
    return topics_controller.restart_connector(connector_name)

@router.delete("/delete_connector", response_model=dict)
async def delete_connector(connector_name: str):
    return topics_controller.delete_connector(connector_name)

