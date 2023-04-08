from .alert_notifications import alert_notifications
import asyncio
import json

import sys
class NotificationSender:

    @staticmethod
    def send_email_to_subscribers(crypted_city_coords: str) -> None:
        # read weather alert from json in alerts folder with name crypted_city_coords
        data = {}
        with open(f"alerts/{crypted_city_coords}.json", 'r') as file:
            data = json.load(file)
        weather_alert = data['alerts'][0]
        asyncio.run(alert_notifications.send_email_to_subscribers(weather_alert, crypted_city_coords))

notification_sender = NotificationSender()
notification_sender.send_email_to_subscribers(sys.argv[1])