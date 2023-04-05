FROM python
WORKDIR /Producer/
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "produce.py"]
EXPOSE 3000
