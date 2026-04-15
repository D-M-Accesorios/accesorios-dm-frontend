# Etapa 1: build
FROM node:20 AS build

WORKDIR /accesorios-dm-frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod -R 755 node_modules/.bin
RUN npm run build

FROM nginx:alpine

COPY --from=build /accesorios-dm-frontend/dist/accesorios-dm-frontend-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
