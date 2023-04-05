from fastapi import APIRouter
from ..controllers.topics_controller import topics_controller

router = APIRouter(
    prefix='/topics',
    tags=['Topics']
)


@router.get("/manage_subscription", response_model=dict)
async def manage_subscriptions(lat: str, lon: str):
    return topics_controller.manage_subscriptions(lat, lon)
