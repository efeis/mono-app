FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=http://localhost:8080
RUN npm run build
CMD ["npm", "run", "dev"]