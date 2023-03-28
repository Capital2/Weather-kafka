
from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession

 
KAFKA_TOPIC = "2467959"
KAFKA_SERVER = "0.0.0.0:9092"

# creating an instance of SparkSession
spark_session = SparkSession \
    .builder \
    .appName("Python Spark create RDD") \
    .getOrCreate()

# Subscribe to 1 topic
df = spark_session \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", KAFKA_SERVER) \
    .option("subscribe", KAFKA_TOPIC) \
    .load()
print(df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)"))

#obscure command 
#sudo spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1 test_apacheSpark.py
