from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Template

from subscriber_repository import subscriber_repository

NOTIFICATION_EMAIL_TEMPLATE = '../templates/notification_email.html'

class AlertNotifications:
    def __init__(self) -> None:
        self.connection_conf = ConnectionConfig(
            MAIL_USERNAME ="weather.app.alerts@outlook.com",
            MAIL_PASSWORD = "147852369Alerts", # Noice
            MAIL_FROM = "weather.app.alerts@outlook.com",
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
        
        subscribers = [subscriber.email for subscriber in subscriber_repository.get_subscribers_by_city(crypted_city_coords)]
        
        subject = f"Extreme Weather Alert from { weather_alert['sender_name'] }"
        
        message_schema = MessageSchema(
            subject=subject,
            recipients=subscribers,
            body=body,
            subtype="html"
        )

        fm = FastMail(self.connection_conf)
        await fm.send_message(message=message_schema, template_name=body)
        

    def _render_template(self, **kwargs) -> str:
        with open(NOTIFICATION_EMAIL_TEMPLATE, 'r') as template:
            content = template.read()
            rendered = Template(content).render(**kwargs)
        return rendered

alert_notifications = AlertNotifications()
