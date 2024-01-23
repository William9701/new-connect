#!/usr/bin/python3
""" objects that handles all default RestFul API actions for replyComment """
from models.reply_comment import ReplyComment
from models.comment import Comment
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_views.route('/comments/<comment_id>/replyComment', methods=['GET'], strict_slashes=False)
@swag_from('documentation/replyComment/replyComment_by_comment.yml', methods=['GET'])
def get_replyComments(comment_id):
    """
    Retrieves the list of all replyComment objects
    of a specific comment, or a specific replyComment
    """
    replyComments = storage.get_replyComments(ReplyComment, comment_id)
    if replyComments is None:
        replyComments = []
    return jsonify([replyComment.to_dict() for replyComment in replyComments])



@app_views.route('/replyComment/<replyComment_id>/', methods=['GET'], strict_slashes=False)
@swag_from('documentation/replyComment/get_replyComment.yml', methods=['GET'])
def get_replyComment(replyComment_id):
    """
    Retrieves a specific replyComment based on id
    """
    replyComment = storage.get(ReplyComment, replyComment_id)
    if not replyComment:
        abort(404)
    return jsonify(replyComment.to_dict())


@app_views.route('/replyComment/<replyComment_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/replyComment/delete_replyComment.yml', methods=['DELETE'])
def delete_replyComment(replyComment_id):
    """
    Deletes a replyComment based on id provided
    """
    replyComment = storage.get(ReplyComment, replyComment_id)

    if not replyComment:
        abort(404)
    storage.delete(replyComment)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/comments/<user_id>/<comment_id>/replyComment', methods=['POST'],
                 strict_slashes=False)
@swag_from('documentation/replyComment/post_replyComment.yml', methods=['POST'])
def post_replyComment(comment_id, user_id):
    """
    Creates a replyComment
    """
    comment = storage.get(Comment, comment_id)
    if not comment:
        abort(404)
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'user_id' not in request.get_json():
        abort(400, description="Missing user_id")

    data = request.get_json()
    instance = ReplyComment(**data)
    instance.save()
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/replyComment/<replyComment_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/replyComment/put_replyComment.yml', methods=['PUT'])
def put_replyComment(replyComment_id):
    """
    Updates a replyComment
    """
    replyComment = storage.get(ReplyComment, replyComment_id)
    if not replyComment:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'comment_id', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(replyComment, key, value)
    storage.save()
    return make_response(jsonify(replyComment.to_dict()), 200)
