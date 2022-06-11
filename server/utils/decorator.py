"""
Copyright @2022 Gamer.AI All rights reserved.
"""
import functools

from flask import request

from errors.api_error import InvalidUserInputError


def parse_argument(arg_name: str, arg_type: type, default=None, required=False):

    def wrapper(func):

        @functools.wraps(func)
        def wrapped_func(*args, **kwargs):
            json_data = None
            found = False
            arg_value = default

            if arg_name in request.values:
                if issubclass(arg_type, list):
                    arg_value = request.values.getlist(arg_name)
                else:
                    arg_value = request.values.get(arg_name)
                found = True
            else:
                json_data = request.get_json(
                    silent=True) or request.values or None

            if json_data:
                if arg_name in json_data:
                    arg_value = json_data.get(json_name)
                    found = True

            if required and not found:
                raise InvalidUserInputError(arg_name)
            return func(*args, **kwargs, **{arg_name: arg_value})

        return wrapped_func

    return wrapper
