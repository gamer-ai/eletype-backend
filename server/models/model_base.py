"""
Copyright @2022 Gamer.AI All rights reserved.
"""
from pymongo import MongoClient


class ModelBase:

    def __init__():
        self.client = MongoClient('mongodb://localhost:27017/')

    def get_db(db_name: str):
        return client[db_name]



