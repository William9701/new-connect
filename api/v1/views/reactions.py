#!/usr/bin/python3
""" objects that handle all default RestFul API actions for reactions """
from models.reaction import Reaction
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/reactions/<string:content_id>/', methods=['GET'])
def get_reactions(content_id):
    all_reactions = storage.all(Reaction).values()
    likes_count = sum(1 for reaction in all_reactions if reaction.reaction ==
                      'like' and reaction.content_id == content_id)
    dislikes_count = sum(1 for reaction in all_reactions if reaction.reaction ==
                         'dislike' and reaction.content_id == content_id)
    return jsonify({'likes': likes_count, 'dislikes': dislikes_count})


@app_views.route('/reactions', methods=['POST'], strict_slashes=False)
@swag_from('documentation/reaction/post_reaction.yml', methods=['POST'])
def post_reaction():
    """
    Creates or updates a reaction
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    user_id = data.get('user_id')
    content_id = data.get('content_id')
    new_reaction = data.get('reaction')

    # find existing reaction
    existing_reaction = storage.get_reaction(Reaction, user_id, content_id)

    if existing_reaction is not None:
        # update existing reaction
        existing_reaction.reaction = new_reaction
    else:
        # create new reaction
        existing_reaction = Reaction(**data)

    existing_reaction.save()
    return make_response(jsonify(existing_reaction.to_dict()), 201)


@app_views.route('/reactions/<reaction_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/reaction/put_reaction.yml', methods=['PUT'])
def put_reaction(reaction_id):
    """
    Updates a reaction
    """
    reaction = storage.get(Reaction, reaction_id)

    if not reaction:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(Reaction, key, value)
    storage.save()
    return make_response(jsonify(reaction.to_dict()), 200)


@app_views.route('/reactions/<reaction_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/reaction/delete_reaction.yml', methods=['DELETE'])
def delete_reaction(reaction_id):
    """
    Deletes a reaction Object
    """

    reaction = storage.get(Reaction, reaction_id)

    if not reaction:
        abort(404)

    storage.delete(Reaction)
    storage.save()

    return make_response(jsonify({}), 200)
