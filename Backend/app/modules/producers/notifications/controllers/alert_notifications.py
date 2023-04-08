from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Template

from .subscriber_repository import subscriber_repository

from time import sleep

NOTIFICATION_EMAIL_TEMPLATE = 'modules/producers/notifications/templates/notification_email.html'

class AlertNotifications:
    def __init__(self) -> None:
        self.connection_conf = ConnectionConfig(
            MAIL_USERNAME ="weather.app.alerts1@outlook.com",
            MAIL_PASSWORD = "147852369Alerts", # Noice
            MAIL_FROM = "weather.app.alerts1@outlook.com",
            MAIL_FROM_NAME = "Weather Alerts",
            MAIL_SERVER="smtp.office365.com",
            MAIL_PORT = 587,
            VALIDATE_CERTS=True,
            MAIL_SSL_TLS=False,
            MAIL_STARTTLS=True,
            USE_CREDENTIALS=True
            
        )


    async def send_email_to_subscribers(self, weather_alert: dict, crypted_city_coords: str) -> None:
        body = self._render_template(alert=weather_alert)
        
        subscribers = []
        for subscriber in subscriber_repository.get_subscribers_by_city(crypted_city_coords):
            if subscriber.is_sent: # skip if already sent
                continue
            subscribers.append(subscriber.email)
        if not subscribers:
            return
        subject = f"Extreme Weather Alert from { weather_alert['sender_name'] }"
        for subscriber in subscribers:
            message_schema = MessageSchema(
                subject=subject,
                recipients=[subscriber],
                body=body,
                subtype="html"
            )
            tries = 10
            while tries > 0:
                try:
                    fm = FastMail(self.connection_conf)
                    await fm.send_message(message=message_schema, template_name=body)
                except Exception as e:
                    print("Exception occurred:", e)
                    print("Exception class:", type(e).__name__)
                    tries -= 1
                    sleep(0.2)
                    continue
                break

        subscriber_repository.set_subscribers_sent(crypted_city_coords)
        

    def _render_template(self, **kwargs) -> str:
        with open(NOTIFICATION_EMAIL_TEMPLATE, 'r') as template:
            content = template.read()
            rendered = Template(content).render(**kwargs)
        return rendered

alert_notifications = AlertNotifications()
