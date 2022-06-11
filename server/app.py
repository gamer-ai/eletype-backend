"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import logging

from flask import Flask, jsonify

from endpoints.user import user_api


def create_app(name: str):

    def error_handler(e: Exception):
        message = 'Uncaught exception: {}'.format(repr(e))
        logging.error('Uncaught exception',
                      exc_info=(type(e), e, e.__traceback__))
        response = jsonify({'error': {
            'message': message,
        }})
        return response

    app = Flask(name)
    app.register_error_handler(Exception, error_handler)
    logging.error("haha")
    return app


app = create_app(__name__)


def setup():
    app.register_blueprint(user_api)


setup()
