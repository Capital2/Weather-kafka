from ..exceptions.topics_exceptions import ExistantTopicName, AddTopicError
import os


class TopicsManager():   
    
    def __init__(self):
        self.kafka_container_id = self.get_container_id("confluentinc/cp-kafka")

    def get_container_id(self, container_name:str):
        """
        Gets the container ID for the specified Docker container.

        Args:
            container_name (str): The name of the Docker container.

        Returns:
            The ID of the specified Docker container.

        Raises:
            Exception: If the Docker container is not found or if there is an error executing the command.
        """

        cmd = 'docker ps --format "table {{.ID}}\t{{.Image}}" | grep ' + container_name      
        with os.popen(cmd) as result:           
            container = result.readlines()
            print("wzap")
            print(container)
            if len(container) == 0:
                raise Exception("Container not found") # chroufa upodate this
            container = container[0].split(" ")[0]
            return container


    def list_topics(self) -> set:
        """
        Lists all the topics in the Kafka cluster.

        Returns:
            A set of strings, where each string is the name of a topic in the Kafka cluster.

        Raises:
            Exception: If there are no topics in the Kafka cluster or if there is an error executing the command.
        """
        
        list_topics_cmd = f"docker exec -it {self.kafka_container_id} /bin/kafka-topics --list --bootstrap-server localhost:9092"        
        with os.popen(list_topics_cmd) as list_topics_cmd_result:
            topics = list_topics_cmd_result.readlines()
            if len(topics) == 0:
                raise Exception("Topics list error") #hamma update this
            
            topics = set(map(lambda topic: topic.replace('\n', ''), topics))
            
            return topics        
        
        
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

        create_topic_cmd = f"docker exec -it {self.kafka_container_id} kafka-topics --create --topic {new_topic} --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1"
        if new_topic in self.list_topics():
            raise ExistantTopicName("Topic name already used !")
        
        result = os.system(create_topic_cmd)
        if result != 0:
            raise AddTopicError("Create topic command error")
        
        return self.list_topics()
            

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

        delete_topic_cmd = f"docker exec -it {self.kafka_container_id} kafka-topics --delete --topic {topic_name} --bootstrap-server localhost:9092"
        if topic_name not in self.list_topics():
            raise Exception("Topic name does not exist !") # to update
        
        result = os.system(delete_topic_cmd)
        if result != 0:
            raise Exception("delete topic command error") #to ipdate
        
        return self.list_topics()
    

topics_manager = TopicsManager()
