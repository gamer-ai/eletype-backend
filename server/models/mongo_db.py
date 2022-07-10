"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import os
import logging

from urllib.parse import quote_plus

from pymongo import MongoClient


class MongoDb:

    def __init__(self):
        username = os.environ['MONGO_USERNAME']
        password = os.environ['MONGO_PASSWORD']
        host = os.environ['MONGO_HOSTNAME']
        self.client = MongoClient(f'mongodb://{host}:27017/',
                                  username=username,
                                  password=password)

    def get_db(self, db_name: str):
        return self.client[db_name]
