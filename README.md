# 💡 Hetic Urban Data Analytics 💡

Application permettant de visualiser et d'analyser les données de transport (vélos en libre-service) dans le monde.

## 👤️ Authors 👤

- Benoît Favrie ([@benoitfvr](https://github.com/benoitfvr))<br />
- Paul Mazeau ([@PaulMazeau](https://github.com/PaulMazeau))<br />
- Nicolas Marsan ([@NicoooM](https://github.com/NicoooM))<br />
- Antonin Charpentier ([@toutouff](https://github.com/toutouff))<br />

## How to launch the project

### Backend

```bash
# Create a venv
python3 -m venv .venv
# Enter the venv
source .venv/bin/activate
# Install the dependencies
pip install -r requirements.txt

# Migrate the database
python manage.py migrate

# Populate the database
python manage.py sync_bikes
python manage.py sync_penalties
python manage.py sync_traffic

# Run the server
daphne backend.asgi:application
```

### Frontend

```bash
# Install the dependencies
npm install

# Run the server
npm run start
```

Make sure to have the .env in the frontend directory based on the .env.example

## Websocket doc

### Connect to WebSocket

```javascript
const socket = new WebSocket("ws://" + window.location.host + "/ws/data/");
```

### Handle connection open

```javascript
socket.onopen = function (e) {
  console.log("Connected to server");
};
```

### Handle incoming messages

```javascript
socket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  // Update your visualization here
  updateVisualization(data);
};
```

### Handle connection close

```javascript
socket.onclose = function (e) {
  console.log("Disconnected from server");
};
```

### Send data to server

```javascript
function sendData(data) {
  socket.send(JSON.stringify(data));
}
```
