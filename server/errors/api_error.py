"""
Copyright @2022 Gamer.AI All rights reserved.
"""


class ApiBaseError(Exception):

    def message(self):
        raise NotImplementedError('Unexpected error')

    def __str__(self):
        return str(self.get_message())


class InvalidUserInputError(ApiBaseError):

    def __init__(self, message=None):
        super().__init__()
        self.message = message or 'Invalid user input data'

    def get_message(self):
        return self.message
