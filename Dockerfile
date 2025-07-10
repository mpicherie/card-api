# Utilise une image Node officielle
FROM node:18-slim

# Installe Chromium et dépendances
RUN apt-get update && apt-get install -y \
    chromium chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Définit le répertoire de travail
WORKDIR /usr/src/app

# Copie package.json et installe les dépendances
COPY package*.json ./
RUN npm install

# Copie le reste du projet
COPY . .

# Définit la variable d’environnement pour Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose le port
EXPOSE 3000

# Démarre l’application
CMD ["npm", "start"]
