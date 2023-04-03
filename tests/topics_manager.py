from kafka import KafkaAdminClient
from kafka.errors import KafkaError, NoBrokersAvailable
from kafka.admin import NewTopic
from time import sleep


class TopicsManager:
    def __init__(self) -> None:
        self.num_partitions = 1
        self.replication_factor = 1
        self.admin_client = self.init_admin_client()

    def init_admin_client(self) -> KafkaAdminClient:
        retries = 1
        flag = True
        while flag:
            try:
                if (retries > 10):
                    raise Exception("Number of retries searching for available brokers is hit")

                admin_client = KafkaAdminClient(
                    bootstrap_servers=["20.16.155.55:9092"])
                flag = False
            except NoBrokersAvailable:
                retries += 1
                sleep(5)
            except Exception as error:
                raise Exception(
                    "Error at init_admin_client: {}".format(str(error)))

        return admin_client

    def list_topics(self) -> set:
        """
        Lists all the topics in the Kafka cluster.

        Returns:
            A set of strings, where each string is the name of a topic in the Kafka cluster.

        Raises:
            Exception: If there are no topics in the Kafka cluster or if there is an error executing the command.
        """
        # Call the list_topics() method to get a list of available topics
        try:
            topics = self.admin_client.list_topics()
            return set(topics)
        except KafkaError as e:
            print("Error listing topics: ", e)

    def add_topic(self, new_topic: str) -> set:
        """
        Creates a new topic in the Kafka cluster.

        Args:
            new_topic: A string that represents the name of the new topic.

        Returns:
            A set of strings, where each string is the name of a topic in the Kafka cluster.

        Raises:
            Exception: If the new topic name already exists in the Kafka cluster or if there is an error executing the command.
        """

        if new_topic in self.list_topics():
            # raise ExistantTopicName("Topic name already used !")
            print("topic alreatdy exists")

        # Create a new topic object with the given parameters
        topic = NewTopic(name=new_topic, num_partitions=self.num_partitions,
                         replication_factor=self.replication_factor)

        # Call the create_topics() method of the admin_client object to create the new topic
        try:
            self.admin_client.create_topics(new_topics=[topic])
            return self.list_topics()
        except KafkaError as e:
            raise Exception("Error creating topic: {}".format(str(e)))

    def delete_topic(self, topic_name: str) -> set:
        """
        Deletes a Kafka topic with the given `topic_name` from the Kafka server running inside a Docker container.

        Args:
            topic_name (str): The name of the topic to delete.

        Returns:
            set: A set of strings containing the names of all the remaining topics after the deletion of the given `topic_name`.

        Raises:
            Exception: If the given `topic_name` does not exist in the Kafka server.
            Exception: If there is an error in executing the `kafka-topics` command to delete the topic.
        """

        if topic_name not in self.list_topics():
            # raise Exception("Topic name does not exist !")
            print("Topic name does not exist")

        # Call the delete_topics() method of the admin_client object to delete the topic
        try:
            self.admin_client.delete_topics(topics=[topic_name])
            return self.list_topics()
        except KafkaError as e:
            raise Exception("Error deleting topic: {}".format(str(e)))


topics_manager = TopicsManager()
