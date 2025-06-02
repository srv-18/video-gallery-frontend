FROM node:22.13.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc -b
EXPOSE 5173
CMD ["npm", "run", "dev"]