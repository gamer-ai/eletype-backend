"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import flask

from flask import jsonify

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
