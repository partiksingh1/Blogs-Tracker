FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the frontend
RUN npm run build

# Serve the build with a lightweight server (optional: vite preview)
# Bind to 0.0.0.0 for Docker
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
