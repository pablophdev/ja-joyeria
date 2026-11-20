FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_AUTH_URL=/api/auth VITE_CATALOGO_URL=/api/catalogo VITE_PEDIDOS_URL=/api/pedidos VITE_COMUNICACIONES_URL=/api/comunicaciones
RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
