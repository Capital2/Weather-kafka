import requests
from cassandra.cluster import Cluster

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


    def create_cassandra_table(self, table_name: str):
        """
        Creates a new Cassandra table with the specified name and a single column called 'data'.

        Parameters:
            table_name (str): The name of the table to create.

        Returns:
            None: This function does not return anything, but creates a new Cassandra table.

        Raises:
            cassandra.cluster.NoHostAvailable: If the Cassandra cluster is not available or cannot be reached.
        """

        cluster = Cluster(['localhost']) 
        session = cluster.connect('weather')

        # Create table
        query = f"CREATE TABLE IF NOT EXISTS {table_name} (data text PRIMARY KEY)"
        session.execute(query)

        # Close connection
        session.shutdown()
        cluster.shutdown()


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
        encrypted_city_coordinates = topic_name.lower()
        self.create_cassandra_table(encrypted_city_coordinates)

        headers = {'Content-Type': 'application/json'}
        data = {
            "name": connector_name,
            "config": {
                "connector.class": "com.datastax.oss.kafka.sink.CassandraSinkConnector",
                "tasks.max": "1",
                "topics": topic_name,
                "contactPoints": "cassandra",
                "loadBalancing.localDc": "datacenter1",
                f"topic.{topic_name}.weather.{encrypted_city_coordinates}.mapping": "data=value",
                f"topic.{topic_name}.weather.{encrypted_city_coordinates}.consistencyLevel": "LOCAL_QUORUM" 
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

