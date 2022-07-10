"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import logging
import os

from flask import Flask, jsonify, request, send_from_directory

from endpoints.user import user_api


def create_app(name: str):

    def error_handler(e: Exception):
        logging.error(request.get_json())
        message = 'Uncaught exception: {}'.format(repr(e))
        logging.error('Uncaught exception',
                      exc_info=(type(e), e, e.__traceback__))
        response = jsonify({'error': {
            'message': message,
        }})
        return response

    app = Flask(name)
    app.register_error_handler(Exception, error_handler)
    return app


app = create_app(__name__)


def setup():
    app.register_blueprint(user_api)


setup()
