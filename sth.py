import requests

response = requests.get("https://scheduler.talantiuspeh.ru/app.php/meeting/display?name=%D0%9D%D0%B0%D1%83%D0%BA%D0%B0")

print(response.json())