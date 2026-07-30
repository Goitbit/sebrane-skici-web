FROM node:20-slim

WORKDIR /app

# Kopírování závislostí a instalace
COPY package*.json ./
RUN npm install

# Kopírování zbytku kódu
COPY . .

# Otevření portu 3000 pro Fly Proxy
EXPOSE 3000

CMD ["npm", "start"]