#!/usr/bin/python3
""" objects that handle all default RestFul API actions for reactions """
from models.comment_reaction import CommentReaction
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/comments_reaction/<string:comment_id>/', methods=['GET'])
def get_comment_reactions(comment_id):
    all_reactions = storage.all(CommentReaction).values()
    likes_count = sum(1 for reaction in all_reactions if reaction.reaction ==
                      'like' and reaction.comment_id == comment_id)
    dislikes_count = sum(1 for reaction in all_reactions if reaction.reaction ==
                         'dislike' and reaction.comment_id == comment_id)
    return jsonify({'likes': likes_count, 'dislikes': dislikes_count})


@app_views.route('/comment_reaction', methods=['POST'], strict_slashes=False)
@swag_from('documentation/comments/post_reaction.yml', methods=['POST'])
def post_comment_reaction():
    """
    Creates or updates a comment-reaction
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()
    user_id = data.get('user_id')
    comment_id = data.get('comment_id')
    new_reaction = data.get('reaction')

    # find existing reaction
    existing_reaction = storage.get_comment_reaction(
        CommentReaction, user_id, comment_id)

    if existing_reaction is not None:
        # update existing reaction
        existing_reaction.reaction = new_reaction
    else:
        # create new reaction
        existing_reaction = CommentReaction(**data)

    existing_reaction.save()
    return make_response(jsonify(existing_reaction.to_dict()), 201)


@app_views.route('/comment_reactions/<reaction_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/reaction/put_reaction.yml', methods=['PUT'])
def put_comment_reaction(reaction_id):
    """
    Updates a reaction
    """
    reaction = storage.get(CommentReaction, reaction_id)

    if not reaction:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(CommentReaction, key, value)
    storage.save()
    return make_response(jsonify(reaction.to_dict()), 200)


@app_views.route('/comment_reactions/<reaction_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/reaction/delete_reaction.yml', methods=['DELETE'])
def delete_comment_reaction(reaction_id):
    """
    Deletes a reaction Object
    """

    reaction = storage.get(CommentReaction, reaction_id)

    if not reaction:
        abort(404)

    storage.delete(reaction)
    storage.save()

    return make_response(jsonify({}), 200)
