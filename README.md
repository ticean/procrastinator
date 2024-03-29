Procrastinator
======================

Procrastinator is a simple delay queue built with Node.js. It asynchronously queues
messages for some time, and calls a webhook when time's up. 

It doesn't perform any actual work. It just puts it off for later.


## Requirements

All the requirements are available via NPM.

- **winston**  Logging.
- **journey**  Routing for the API.
- **optimist** Option parsing.
- **hashlib**  SHA1 id's.

Requirements for running tests:

- **vows**     BDD test framework for node.
- **api-easy** API testing framework.


## Installation


### Install Node.

This installation is aimed at installing Node.js and Procrastinator on an Ubuntu server.

For installation on your development machine, the standard [installation procedure](https://github.com/joyent/node/wiki/Installation)
shown in the [Joyent Node repo](https://github.com/joyent/node/) is probably best. The difference is that the standard install
uses your $HOME directory, which can make things easier to manage.

    sudo apt-get update
    sudo apt-get install git-core curl build-essential openssl libssl-dev
    git clone https://github.com/joyent/node.git && cd node
    git checkout v0.4.11
    ./configure
    make
    sudo make install
    node -v

### Install NPM - the node package manager

    curl http://npmjs.org/install.sh | sudo sh

### Install Required Packages

Packages required for the app:

    npm install winston     # Logging
    npm install journey     # Routing helper
    npm install optimist    # Option Parameter Parsing
    npm install hashlib     # Provides SHA1 hashing for unique keys
    npm install forever     # Keeps the app running as a service

And for running the tests:

    npm install vows        # BDD test framework for Node.js
    npm install api-easy    # API test framework built on Vows





