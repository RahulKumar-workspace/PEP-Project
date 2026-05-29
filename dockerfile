# Build the Frontend 
FROM node:20-alpine AS frontend-builder

COPY ./Frontend /app

WORKDIR /app

RUN npm install
# to build the 'dist' folder

RUN npm run build

#Backend
FROM node:20-alpine

COPY ./Backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public 
# Copy the dist folder content in Backend/public folder

CMD ["node", "server.js"]