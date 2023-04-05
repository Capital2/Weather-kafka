from sqlalchemy import Column, create_engine, String, Table, Integer, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import List

Base = declarative_base()


class Subscriber(Base):
    __tablename__: str = 'subscribers'

    id: str = Column(Integer, primary_key=True)
    email: str = Column(String(255), nullable=False)
    city: str = Column(String(255), nullable=False)
    is_sent: bool = Column(Boolean, default=False)


class SubscriberRepository:
    def __init__(self) -> None:
        engine = create_engine("mysql+pymysql://root@localhost/weather") # TODO: replace this with mysql docker image url
        Session = sessionmaker(bind=engine)
        self.session = Session()
        Base.metadata.create_all(engine)

    def get_subscribers(self) -> List[Subscriber]:
        return self.session.query(Subscriber).all()


    def get_subscribers_by_city(self, city: str) -> List[Subscriber]:
        return self.session.query(Subscriber).filter_by(city=city).all()
    

    def add_subscriber(self, email: str, city: str) -> None:
        subscriber = self.session.query(Subscriber).filter_by(email=email, city=city).first()
        if subscriber: # if subscriber already exists
            return
        subscriber = Subscriber(email=email, city=city)
        self.session.add(subscriber)
        self.session.commit()


    def remove_subscriber(self, email: str, city: str) -> None:
        subscriber = self.session.query(Subscriber).filter_by(email=email, city=city)
        if not subscriber: # if subscriber doesn't exist
            return
        subscriber.delete()
        self.session.commit()


    def set_subscriber_sent(self, email: str, city: str) -> None:
        subscriber = self.session.query(Subscriber).filter_by(email=email, city=city).first()
        if subscriber.is_sent:
            return
        subscriber.is_sent = True
        self.session.commit()


    def set_subscribers_sent(self, city: str) -> None:
        subscribers = self.get_subscribers_by_city(city)
        for subscriber in subscribers:
            self.set_subscriber_sent(subscriber.email, subscriber.city)

    def set_subscriber_not_sent(self, email: str, city: str) -> None:
        subscriber = self.session.query(Subscriber).filter_by(email=email, city=city).first()
        if not subscriber.is_sent: 
            return
        subscriber.is_sent = False
        self.session.commit()
    

    def set_subscribers_not_sent(self, city: str) -> None:
        subscribers = self.get_subscribers_by_city(city)
        for subscriber in subscribers:
            self.set_subscriber_not_sent(subscriber.email, subscriber.city)

    
subscriber_repository = SubscriberRepository()
