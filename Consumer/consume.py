from kafka import KafkaConsumer # pip3 install kafka-python
consumer = KafkaConsumer('greetings', auto_offset_reset='earliest', bootstrap_servers='0.0.0.0:9092')

for msg in consumer:
    print (msg)

consumer.close()
# test