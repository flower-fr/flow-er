Flow-ER V1
==========

prerequisites
-------------
1) Node and NPM in last stable version
3) Mysql or Mariadb in last stable version
5) In addition, to have Flow-ER running, you need several npm packages.

Packages to install :

    env, mysql2

Installation
------------

Retrieve flow-er's code from github as a new node application:

	mkdir flow-er
    cd flow-er/
	git init
    git remote add origin https://github.com/p-pit-sas/flow-er
    git pull origin main

From now on, any path reference is relative to this new flow-er directory.
First we have to define a few settings and environment variables. Create the files etc/settings.json and .env 

    cp etc/settings-template.json etc/settings.json
    cp .env-template .env

While developing your application in the flow-er framework, you will add entries in these files as described later.

The entries in .env have to be completed with the port you choose to use for your node application, the MySQL DB settings and the SMTP server settings.

    # The default listen port
    PORT=

    # MySQL variables
    # DB host
    DB_HOST=
    # DB port
    DB_PORT=
    # DB user
    DB_USER=
    # DB password
    DB_PASSWORD=
    # DB name
    DB_NAME=

    # Default SMTP server variables
    # SMTP server hostname or IP address
    SMTP_SERVER=
    # SMTP server port
    SMTP_PORT=
    # email address to authenticate
    SMTP_USER=
    # the user password
    SMTP_PASSWORD=