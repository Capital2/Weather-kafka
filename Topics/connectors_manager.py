import requests

from topics_manager import TopicsManager

class ConnectorsManager:
    WORKER_IP = "localhost"
    PORT = 8083

    URL = f"http://{WORKER_IP}:{PORT}/connectors"


    def list_connectors(self) -> list:
        """
        Returns a list of all the Kafka Connect connectors available on the system.

        Returns:
            A list of all the Kafka Connect connectors available on the system.

        Raises:
            Exception: If the request to retrieve the list of connectors fails for any reason.
        """

        response = requests.get(url=self.URL)
        if response.status_code != 200:
            raise f"Error: {response.status_code}"

        return response.json()


    def create_connector(self, connector_name: str, topic_name: str) -> list:
        """
        Creates a new Kafka Connect connector with the specified name and topic.

        Args:
            connector_name (str): The name to assign to the new connector.
            topic_name (str): The name of the topic to use for the connector.

        Returns:
            A list of all the Kafka Connect connectors available on the system after the new connector is created.

        Raises:
            Exception: If the specified topic does not exist, or if the creation of the new connector fails for any other reason.
        """

        if topic_name not in TopicsManager().list_topics():
            raise Exception(f'Topic {topic_name} does not exist !')
        
        headers = {'Content-Type': 'application/json'}
        data = {
            "name": connector_name,
            "config": {
                "connector.class": "com.datastax.oss.kafka.sink.CassandraSinkConnector",
                "tasks.max": "10",
                "topics": topic_name,
                "contactPoints": "cassandra",
                "loadBalancing.localDc": "datacenter1",
                # TODO: Map Kafka topic with its corresponding Cassandra table and columns
                # Format: topicField1=CassandraColumnName1, topicField2=CassandraColumnName2, ...  
                f"topic.{topic_name}.weather.tab.mapping": "name=value",
                f"topic.{topic_name}.weather.tab.consistencyLevel": "LOCAL_QUORUM" 
            }
        }
        response = requests.post(url=self.URL, json=data, headers=headers)
        if response.status_code != 201:
            raise Exception(response.json())

        return self.list_connectors()


    def restart_connector(self, connector_name: str) -> list:
        """
        Restarts the specified Kafka Connect connector.

        Args:
            connector_name (str): The name of the connector to restart.

        Returns:
            A list of all the Kafka Connect connectors available on the system after the specified connector is restarted.

        Raises:
            Exception: If the restart of the specified connector fails for any reason.
        """

        url = f"{self.URL}/{connector_name}/restart"
        response = requests.post(url=url)
        if response.status_code != 204:
            raise Exception(response.json())
        
        return self.list_connectors()


    def delete_connector(self, connector_name: str) -> list:
        """
        Deletes the specified Kafka Connect connector.

        Args:
            connector_name (str): The name of the connector to delete.

        Returns:
            A list of all the Kafka Connect connectors available on the system after the specified connector is deleted.

        Raises:
            Exception: If the deletion of the specified connector fails for any reason.
        """

        url = f'{self.URL}/{connector_name}'
        
        response = requests.delete(url=url)

        if response.status_code != 204:
            raise Exception(response.json())
        
        return self.list_connectors()
