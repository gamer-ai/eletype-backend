"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import flask
import logging

from flask import jsonify

from models.mongo_db import MongoDb
from utils.decorator import parse_argument

user_api = flask.Blueprint('user', __name__, url_prefix='/user')


@user_api.route('/test', methods=['GET'])
@parse_argument('username', str, required=True)
def handle_username(username: str):
    """ This is a test call. Will replace it soon. """
    response = {
        "result": {
            "username": username,
        },
        # TODO(lele94218): define status as an enum class.
        "status": "succeed",
    }
    return jsonify(response)


@user_api.route('/db', methods=['GET'])
def handle_db():
    db_client = MongoDb()
    logging.error(db_client.get_db('user_db').list_collection_names())

    user = db_client.get_db('user_db').users.find_one()
    logging.error(user)
    return jsonify({
        "status": "succeed",
    })
