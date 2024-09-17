# Connnect


# Awesome Video Hub Website

Welcome to the Connect, your Hub for dynamic moments! This web application allows users to upload live-recorded content directly to the site. No prerecorded videos here—just real-time action! The app is built using Python, JavaScript, HTML, and CSS, and it runs on two Flask apps: the main app and the API app.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Apps](#running-the-apps)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Getting Started

To get up and running with the Awesome Video Hub, follow these steps:

### Prerequisites

1. **Python 3.8**: Make sure you have Python 3.8 installed on your Linux-based machine. If not, you can download it from the official Python website.

2. **MariaDB**: You'll need MariaDB (a MySQL-compatible database) for storing video metadata and libmysqlclient-dev Python package that allows Flask to interact with MariaDB. If you haven't already, install MariaDB. 

    ```bash
    sudo apt-get install libmariadb-dev
    sudo apt-get install libmysqlclient-dev
    ```

### Installation

1. Clone this repository:

    ```bash
    git clone git@github.com:William9701/new-connect.git
    cd new-connect
    ```

2. Create a virtual environment (recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. Install project dependencies:

    ```bash
    pip install -r requirement.txt
    ```

4. Install ffmpeg for the content-download setup from there site for linux 
     [here](https://ffmpeg.org/download.html)

### Running the Apps

1. **Main App**:

    ```bash
    python -m web_dynamic.app
    ```

    This will start the main Flask app, which handles user authentication, video uploads, and viewing.

2. **API App**:

    ```bash
    python -m api.v1.app
    ```

    The API app provides endpoints for fetching video data, managing user accounts, and more.

### Usage

1. Open your web browser and navigate to `http://localhost:5000`.

2. Log in using your credentials or create a new account.

3. Start uploading live-recorded videos! Only live content is allowed.

4. view contents, like, share, download and enjoy connect.

### Contributing

We welcome contributions! If you'd like to improve the Awesome Video Hub, feel free to submit pull requests or open issues on our [GitHub repository](https://github.com:William9701/new-connect.git).


