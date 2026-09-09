curl --request GET \
--url https://api54.unipile.com:18453/api/v1/accounts \
--header 'X-API-KEY: ****' \
--header 'accept: application/json'

curl --request GET \
--url 'https://api54.unipile.com:18453/api/v1/users/me?account_id=' \
--header 'X-API-KEY: ****' \
--header 'accept: application/json'

curl --request GET \
--url 'https://api54.unipile.com:18453/api/v1/users/relations?account_id=&limit=1000' \
--header 'X-API-KEY: ****' \
--header 'accept: application/json'

curl --request GET \
--url https://api54.unipile.com:18453/api/v1/users/invite/sent?limit=100 \
--header 'X-API-KEY: ****' \
--header 'accept: application/json'

curl --request GET \
--url https://api54.unipile.com:18453/api/v1/chats \
--header 'X-API-KEY: ****' \
--header 'accept: application/json'

# Calendars

curl --request GET \
     --url 'https://api54.unipile.com:18453/api/v1/calendars?account_id=' \
     --header 'X-API-KEY: ****' \
     --header 'accept: application/json'

curl --request POST \
     --url 'https://api54.unipile.com:18453/api/v1/calendars/bruno%40p-pit.fr/events?account_id=' \
     --header 'X-API-KEY: ****' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{
        "title": "Test de l’API Unipile",
        "body": "Ceci est une invitation automatiquement envoyée avec l’API Unipile.",
        "location": "Visio / Bureau",
        "start": {
            "date_time": "2026-09-08T09:00:00Z",
            "time_zone": "Europe/Paris"
        },
        "end": {
            "date_time": "2026-09-08T09:30:00Z",
            "time_zone": "Europe/Paris"
        },
        "attendees": [
        {
            "email": "..."
        },
        {
            "email": "..."
        }
        ],
        "notify": true
    }'

curl --request DELETE \
     --url 'https://api54.unipile.com:18453/api/v1/calendars/bruno%40p-pit.fr/events/ahlpjg6vm6pchml7uiqm37boig?account_id=' \
     --header 'X-API-KEY: ****' \
     --header 'accept: application/json' \
     --header 'content-type: application/json'