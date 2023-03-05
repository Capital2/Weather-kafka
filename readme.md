https://hub.docker.com/r/bitnami/kafka

# zookeeper
sudo docker run -d --name zookeeper-server \
    -e ALLOW_ANONYMOUS_LOGIN=yes \
    bitnami/zookeeper:latest

-start sink endPoint: curl -X POST -H "Content-Type: application/json" -d @connector-config.json "http://localhost:8083/connectors"
 restart sink : curl -X POST "http://worker_ip:rest_port/connectors/connector_name/restart"
 delete sink : curl -X DELETE "http://worker_ip:port/connectors/connector_name"

## Todo
create a volume for cassandra 

create keyspace weather with replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

use weather
create table tab (name text primary key);
###
