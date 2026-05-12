FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY vite.config.js .
COPY index.html .
COPY src ./src
ARG VITE_API_BASE=http://backend:8080/api
ENV VITE_API_BASE=${VITE_API_BASE}
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
