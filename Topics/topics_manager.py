import os

class TopicsManager():   
    
    def __init__(self):
        self.kafka_container_id = self.get_container_id("kafka")

    def get_container_id(self, container_name:str):
        # return the container id of a given image name
        container: str
        cmd = 'docker ps --format "table {{.ID}}\t{{.Image}}" | grep ' + container_name
        with os.popen(cmd) as result:
            container = result.readlines()
            if len(container) == 0:
                raise Exception("Container not found")
            container = container[0].split(" ")[0]
            return container


    def list_topics(self) -> set:
        # Running the command to list all the topics                
        list_topics_cmd = f"docker exec -it {self.kafka_container_id} /bin/kafka-topics --list --bootstrap-server localhost:9092"        
        topics: set
        with os.popen(list_topics_cmd) as list_topics_cmd_result:
            topics = list_topics_cmd_result.readlines()
            if len(topics) == 0:
                raise Exception("Topics list error")
            
            # Formatting the topics and removing the \n char from the list of strings
            topics = set(map(lambda topic: topic.replace('\n', ''), topics))
            return topics        
        
        
    def add_topic(self, new_topic: str) -> set:
        create_topic_cmd = f"docker exec -it {self.kafka_container_id} kafka-topics --create --topic {new_topic} --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1"
        if new_topic in self.list_topics():
            raise Exception("Topic name already used !")
        
        result = os.system(create_topic_cmd)
        if result != 0:
            raise Exception("Create topic command error")
        
        return self.list_topics()
            

    def delete_topic(self, topic_name: str) -> set:
        delete_topic_cmd = f"docker exec -it {self.kafka_container_id} kafka-topics --delete --topic {topic_name} --bootstrap-server localhost:9092"
        if topic_name not in self.list_topics():
            raise Exception("Topic name does not exist !")
        
        result = os.system(delete_topic_cmd)
        if result != 0:
            raise Exception("delete topic command error")
        
        return self.list_topics()

          
                





topics_manager = TopicsManager()
print("list topics")
print(topics_manager.list_topics())





# print("old list to topics")
# print(topics_manager.list_topics())
# topics_manager.add_topic("hammaChroufaXXXS")
# print("new list to topics")
# print(topics_manager.list_topics())

# topics_manager.delete_topic("hammaChroufaXXXS")
# print("After delete")
# print(topics_manager.list_topics())
# topics_manager.get_container_id("kafka")