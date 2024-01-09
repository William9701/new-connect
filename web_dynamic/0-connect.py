from flask import redirect, url_for, session
from flask import request, jsonify
import os
import uuid
from flask import flash, abort, redirect, url_for

from models import storage
from models.content import Content
from models.location import Location
from models.user import User
from flask import Flask, render_template, request, session
from flask_bcrypt import Bcrypt
from models.user import User
from jinja2 import Environment, select_autoescape
from datetime import datetime
from models.library import Library
from models.reaction import Reaction
from models.engine import db_storage
import requests

app = Flask(__name__)
app.secret_key = 'william667'
bcrypt = Bcrypt(app)


# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/content', strict_slashes=False)
def content_list():
    """ displays a HTML page with a list of contents"""
    cache_id = str(uuid.uuid4())
    contents = storage.all(Content).values()
    users = storage.all(User).values()
    locations = storage.all(Location).values()

    return render_template('index.html', contents=contents, locations=locations, users=users, cache_id=cache_id)


# Update the /camera route to accept user_id parameter


@app.route('/camera/<string:user_id>', strict_slashes=False)
def camera(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)

    return render_template('camera.html', user=user)


@app.route('/upload', methods=['POST'], strict_slashes=False)
def upload_file():
    file = request.files['file']
    save_path = os.path.join(os.pardir, 'new-connect', 'web_dynamic',
                             'static', 'vidFiles', 'videos', file.filename)
    file.save(save_path)
    # Construct the relative URL of the saved file
    file_url = '../static/vidFiles/videos/' + file.filename

    return 'File uploaded successfully' + "  " + file_url


@app.route('/upload_snapshot', methods=['POST'], strict_slashes=False)
def upload_snap():
    file = request.files['file']
    save_path = os.path.join(os.pardir, 'new-connect', 'web_dynamic',
                             'static', 'vidFiles', 'images', file.filename)
    file.save(save_path)
    return 'File uploaded successfully'


@app.route('/deleteContent/<content_id>', methods=['DELETE'], strict_slashes=False)
def delete_file(content_id):
    # Get the file path
    content = storage.get(Content, content_id)
    file_path = content.content
    # Extract the filename from the file path
    filename = os.path.basename(file_path)
    file_path = os.path.join(os.pardir, 'new-connect', 'web_dynamic',
                             'static', 'vidFiles', 'videos', filename)
    # Check if the file exists
    if os.path.exists(file_path):
        # Delete the file
        os.remove(file_path)
        return 'File deleted successfully'
    else:
        return 'File not found'


@app.route('/login', strict_slashes=False, methods=['GET', 'POST'])
def login():
    cache_id = str(uuid.uuid4())
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the first character of the username is '@'
        if not username.startswith('@'):
            # If not, append '@' to the start of the username
            username = '@' + username

        users = storage.all(User).values()
        locations = storage.all(Location).values()
        contents = storage.all(Content).values()

        for user in users:
            if user.username == username:
                if bcrypt.check_password_hash(user.password, password):
                    # Successful login, you can redirect to another page or return a response
                    return render_template('user-index.html', user=user, users=users, cache_id=cache_id,
                                           locations=locations,
                                           contents=contents)
                else:
                    # Incorrect password
                    flash("Invalid password. Please try again.")
                    return render_template('login.html')
        # Incorrect username
        flash("Invalid username. Please try again.")
        return render_template('login.html')

    # Render the login page for GET requests
    return render_template('login.html')


@app.route('/user_index', methods=['POST', 'GET'], strict_slashes=False)
def user_indexs():
    code = request.args.get('code')

    if 'access_token' not in session:
        # If access token is not in the session, obtain it and store it
        data = {
            'code': code,
            'client_id': "265988099697-sn5uq926872kqb0t0nlelaks7kpootv9.apps.googleusercontent.com",
            'client_secret': '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',
            'redirect_uri': 'http://127.0.0.1:5000/user_index',
            'grant_type': 'authorization_code'
        }

        response = requests.post(
            'https://oauth2.googleapis.com/token', data=data)

        if 'access_token' not in response.json():
            return jsonify({'error': 'Access token not found in response'}), 400

        access_token = response.json()['access_token']
        session['access_token'] = access_token
    else:
        # If access token is already in the session, retrieve it
        access_token = session['access_token']

    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(
        'https://www.googleapis.com/oauth2/v3/userinfo', headers=headers)
    print(response)
    info = response.json()
    user_id = info['sub']
    """location_data = requests.get('https://ipapi.co/json/').json()
    user_location = location_data['region']"""
    user = storage.get(User, user_id)
    if user is None:
        m_username = info['family_name'] + info['given_name']
        user = User(
            id=user_id,
            username=m_username,
            last_name=info['family_name'],
            first_name=info['given_name'],
            email=info['email'],
            location='aba',
            description='email registered',
            password='gmail',
            image=info['picture']
        )
        storage.new(user)
        storage.save()

    user = storage.get(User, user_id)
    locations = storage.all(Location).values()
    contents = storage.all(Content).values()
    users = storage.all(User).values()
    cache_id = str(uuid.uuid4())
    return render_template('user-index.html', user=user, cache_id=cache_id, users=users, locations=locations, contents=contents)


@app.route('/user_index/<string:user_id>', strict_slashes=False)
def user_index(user_id):
    user = storage.get(User, user_id)
    locations = storage.all(Location).values()
    contents = storage.all(Content).values()
    users = storage.all(User).values()
    cache_id = str(uuid.uuid4())
    return render_template('user-index.html', user=user, cache_id=cache_id, users=users, locations=locations, contents=contents)


@app.route('/signup', strict_slashes=False)
def signup():
    """ signup page """

    return render_template('signup.html')


@app.route('/logout/<string:user_id>', strict_slashes=False)
def logout(user_id):
    """ Logout page """

    print(user_id)

    # Check if user_id is present
    if user_id:
        user = storage.get(User, user_id)

        # Check if the user object and description are present
        if user and user.description == 'email registered':
            # If the description is 'email-registered', revoke the Google API token
            access_token = session.get('access_token')
            if access_token:
                # Revoke the Google API token
                revoke_token_url = f"https://oauth2.googleapis.com/revoke?token={access_token}"
                requests.post(revoke_token_url)

        # Close the storage session
        storage.close()

    # Clear the session
    session.clear()

    # Redirect to the content_list route (you can change this to your desired route)
    return redirect(url_for('content_list'))


@app.route('/play/<string:content_id>/<string:user_id>/', strict_slashes=False)
def play(content_id, user_id):
    """ play page """
    content = storage.get(Content, content_id)
    user = storage.get(User, user_id)
    users = storage.all(User).values()
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()
    all_reactions = storage.all(Reaction).values()

    # Initialize counts
    likes_counts = {}
    dislikes_counts = {}

    # Count likes and dislikes for each content
    for reaction in all_reactions:
        if reaction.reaction == 'like':
            likes_counts[reaction.content_id] = likes_counts.get(
                reaction.content_id, 0) + 1
        elif reaction.reaction == 'dislike':
            dislikes_counts[reaction.content_id] = dislikes_counts.get(
                reaction.content_id, 0) + 1
    return render_template('play-video.html', content=content, users=users, contents=contents, locations=locations, likes_counts=likes_counts, dislikes_counts=dislikes_counts, user=user)





@app.route('/vid-chat/', strict_slashes=False)
def vid_chat():
    return render_template('receiver.html')


@app.route('/lobby/', strict_slashes=False)
def lobby():
    return render_template('lobby.html')


@app.route('/room/<invite_code>', strict_slashes=False)
def room(invite_code):
    return render_template('room.html', invite_code=invite_code)


@app.route('/vid-chat-s/<string:user_id>', strict_slashes=False)
def vid_chat_s(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('sender.html', user=user)


@app.route('/profile/<string:user_id>', strict_slashes=False)
def user_profile(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('prof_index.html', user=user)


@app.route('/play-lib/<string:content_id>', strict_slashes=False)
def play_lib(content_id):
    """ play page """
    library = storage.get(Library, content_id)
    users = storage.all(User).values()
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()
    return render_template('play-lib.html', library=library, users=users, contents=contents, locations=locations)


@app.route('/library/<string:user_id>', strict_slashes=False)
def library(user_id):
    # Fetch user data using user_id
    user = storage.get(User, user_id)
    contents = storage.all(Content).values()
    locations = storage.all(Location).values()

    if user is None:
        # Handle the case where the user with the given ID is not found
        abort(404)
    return render_template('library.html', user=user, contents=contents, locations=locations)


@app.route('/vid-c/', strict_slashes=False)
def vid_c():
    return render_template('vid_c_index.html')


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000, debug=True)
