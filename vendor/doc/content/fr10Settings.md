[[Main menu](menu.md)]

Flow-ER settings
================

The file _etc/settings.json_ sets the global parameters:
- the server ip address and port,
- the access control list on routes by user roles,
- the config file to use, allowing to switch, in development environment typically, among several client configurations
- The middlewares that activate the features provided by vendor and proprietary modules (see [modules](fr15Modules.md)).

Flow-ER comes with the winston logger (see https://github.com/winstonjs/winston).
The winston logger settings also take place in the Flow-ER’s settings file : log file dir, name, size and number of rotations (optional) and the console boolean.

Example of a development configuration :

    {
        "log": {
            "level" : "info",
            "console" : true,
            "maxsize": 10000000,
            "maxFiles": 10,
            "filename" : "server.log"
        },
        "server" : {
            "bindAddress": "0.0.0.0",
            "listenPort" : "$PORT",
            "middlewares": {
                "core": {
                    "dir": "../vendor/flCore",
                    "prefix": "/core/",
                    "db" : {
                        "host": "$DB_HOST",
                        "port": "$DB_PORT",
                        "user": "$DB_USER",    
                        "password": "$DB_PASSWORD"
                    },
                    "apiKey": "$API_KEY",
                    "smtp": {
                        "smtpServer": "$SMTP_SERVER",
                        "smtpPort": "$SMTP_PORT",
                        "smtpSecure": true,
                        "smtpUser": "$SMTP_USER",
                        "smtpPassword": "$SMTP_PASSWORD",
                        "from": "contact@flow-er.fr"
                    },
                    "imap": {
                        "imapServer": "$IMAP_SERVER",
                        "imapPort": "$IMAP_PORT",
                        "imapUser": "$IMAP_USER",
                        "imapPassword": "$IMAP_PASSWORD"
                    },
                    "sms": {
                        "apiKey": "$API_KEY",
                        "apiSecret": "$API_SECRET",
                        "from": "33629879002"
                    }
                },
                "flBo": {
                    "dir": "../vendor/flBo",
                    "prefix": "/flBo/",
                    "db" : {
                        "host": "$DB_HOST",
                        "port": "$DB_PORT",
                        "user": "$DB_USER",    
                        "password": "$DB_PASSWORD"
                    },
                    "tokenExpirationTime": "$TOKEN_EXPIRATION_TIME",
                    "apiUserId": "$API_USER_ID",
                    "apiUserPassword": "$API_USER_PASSWORD",
                    "apiKey": "$API_KEY"
                }
            }
        },
        "guard": {
            "account": { "roles": ["sales_manager"] },
        },
        "config": {
            "dir": "../config",
            "dbName": "myDatabase",
            "current": ["my-app"]
        }                                
    }
