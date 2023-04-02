from kafka import KafkaConsumer # pip3 install kafka-python
consumer = KafkaConsumer('P36D847569TP11D09386', auto_offset_reset='earliest', bootstrap_servers='0.0.0.0:9092')

for msg in consumer:
    print (msg)

consumer.close()