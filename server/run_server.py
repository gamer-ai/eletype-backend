"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import logging

from app import app

import gunicorn.app.base
from werkzeug.debug import DebuggedApplication


class Application(gunicorn.app.base.Application):

    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__()

    def load_config(self):
        for key, value in self.options.items():
            if key in self.cfg.settings:
                self.cfg.set(key, value)

    def load(self):
        return self.application


def run_server():
    log = logging.getLogger()
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    log.addHandler(stream_handler)
    options = {
        'bind': '{}:{}'.format('0.0.0.0', '4000'),
        'workers': 5,
        'timeout': 300,
    }
    Application(app, options).run()


if __name__ == '__main__':
    run_server()
