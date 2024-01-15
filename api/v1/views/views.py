#!/usr/bin/python3
""" objects that handle all default RestFul API actions for views """
from models.view import View
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/views/<string:content_id>/', methods=['GET'])
def get_views(content_id):
    all_views = storage.all(View).values()
    total = 0
    for view in all_views:
        if view.content_id == content_id:
            total += 1

    return jsonify({'views': total})


@app_views.route('/views', methods=['POST'], strict_slashes=False)
@swag_from('documentation/view/post_view.yml', methods=['POST'])
def post_view():
    """
    Creates or updates a view
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    user_id = data.get('user_id')
    content_id = data.get('content_id')

    # find existing view
    existing_view = storage.get_view(View, user_id, content_id)

    if existing_view is True:
        print(existing_view)
        return jsonify({'views': 'total'})
    else:
        # create new view
        existing_view = View(**data)
        existing_view.save()
        return make_response(jsonify(existing_view.to_dict()), 201)


@app_views.route('/views/<view_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/view/put_view.yml', methods=['PUT'])
def put_view(view_id):
    """
    Updates a view
    """
    view = storage.get(View, view_id)

    if not view:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(view, key, value)
    storage.save()
    return make_response(jsonify(view.to_dict()), 200)


@app_views.route('/views/<view_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/view/delete_view.yml', methods=['DELETE'])
def delete_view(view_id):
    """
    Deletes a view Object
    """

    view = storage.get(View, view_id)

    if not view:
        abort(404)

    storage.delete(view)
    storage.save()

    return make_response(jsonify({}), 200)
