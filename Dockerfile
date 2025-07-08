# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Construire le front (vuejs via vite)
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copier les fichiers buildés dans le dossier attendu par nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config nginx custom si besoin (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Lancer nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
