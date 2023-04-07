from fastapi import APIRouter
from ..controllers.subscriber_repository import subscriber_repository

router = APIRouter(
    prefix='/notifications',
    tags=['Notifications']
)

# add a new subscriber
@router.post("/subscribe", response_model=dict)
async def subscribe(email: str, city_lat_long: str):
    subscriber_repository.add_subscriberr(email, city_lat_long)
    return {"message": "You have been subscribed to weather alerts for this city."}

# remove a subscriber
@router.post("/unsubscribe", response_model=dict)
async def unsubscribe(email: str, city_lat_long: str):
    subscriber_repository.remove_subscriber(email, city_lat_long)
    return {"message": "You have been unsubscribed from weather alerts for this city."} 

