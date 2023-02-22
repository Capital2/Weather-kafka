https://hub.docker.com/r/bitnami/kafka

# zookeeper
sudo docker run -d --name zookeeper-server \
    -e ALLOW_ANONYMOUS_LOGIN=yes \
    bitnami/zookeeper:latest