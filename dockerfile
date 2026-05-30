# Build the Frontend 
FROM node:20-alpine AS frontend-builder

COPY ./Frontend /app

WORKDIR /app

RUN npm install

RUN npm run build
# to build the 'dist' folder

#Backend
FROM node:20-alpine

COPY ./Backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public 
# Copy the dist folder content in Backend/public folder

CMD ["node", "server.js"]