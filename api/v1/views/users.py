#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Users """
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from sqlalchemy.exc import IntegrityError


@app_views.route('/users/<subscriber_id>/subscribe/<subscribed_id>', methods=['POST'], strict_slashes=False)
def subscribe(subscriber_id, subscribed_id):
    """
    Subscribes a user to another user
    """
    subscriber = storage.get(User, subscriber_id)
    subscribed = storage.get(User, subscribed_id)

    if not subscriber or not subscribed:
        abort(404)

    # Add the subscription
    subscriber.subscribed.append(subscribed)
    storage.save()

    return make_response(jsonify(subscriber.to_dict()), 200)

@app_views.route('/users/<subscriber_id>/unsubscribe/<subscribed_id>', methods=['POST'], strict_slashes=False)
def unsubscribe(subscriber_id, subscribed_id):
    """
    Unsubscribes a user from another user
    """
    subscriber = storage.get(User, subscriber_id)
    subscribed = storage.get(User, subscribed_id)

    if not subscriber or not subscribed:
        abort(404)

    # Remove the subscription
    subscriber.subscribed.remove(subscribed)
    storage.save()

    return make_response(jsonify(subscriber.to_dict()), 200)


@app_views.route('/users', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/all_users.yml')
def get_users():
    """
    Retrieves the list of all user objects
    or a specific user
    """
    all_users = storage.all(User).values()
    list_users = []
    for user in all_users:
        list_users.append(user.to_dict())
    return jsonify(list_users)


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/get_user.yml', methods=['GET'])
def get_user(user_id):
    """ Retrieves a user along with their subscribers and subscriptions """
    user = storage.get(User, user_id)
    if not user:
        abort(404)

    user_dict = user.to_dict()

    # Add subscribers and subscriptions to the response
    user_dict['subscribers'] = [
        subscriber.id for subscriber in user.subscribers]
    user_dict['subscribed'] = [subscribed.id for subscribed in user.subscribed]

    return jsonify(user_dict)


@app_views.route('/users/<user_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/user/delete_user.yml', methods=['DELETE'])
def delete_user(user_id):
    """
    Deletes a user Object
    """

    user = storage.get(User, user_id)

    if not user:
        abort(404)

    storage.delete(user)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/users', methods=['POST'], strict_slashes=False)
@swag_from('documentation/user/post_user.yml', methods=['POST'])
def post_user():
    """
    Creates a user
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'email' not in request.get_json():
        abort(400, description="Missing email")
    if 'password' not in request.get_json():
        abort(400, description="Missing password")

    data = request.get_json()
    instance = User(**data)
    try:
        instance.save()
    except IntegrityError as e:
        storage.rollback()  # Rollback the transaction
        if 'unique constraint' in str(e.orig).lower():
            if 'users_username_key' in str(e.orig):
                return make_response(jsonify(error="Username already exists"), 400)
            if 'users_email_key' in str(e.orig):
                return make_response(jsonify(error="Email already exists"), 400)
        else:
            return make_response(jsonify(error="An error occurred"), 500)
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/user/put_user.yml', methods=['PUT'])
def put_user(user_id):
    """
    Updates a user
    """
    user = storage.get(User, user_id)

    if not user:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'email', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(user, key, value)
    storage.save()
    return make_response(jsonify(user.to_dict()), 200)
