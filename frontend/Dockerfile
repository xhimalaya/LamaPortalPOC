FROM node:20-alpine
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "build"]
CMD ["npx", "serve", "-s", "dist", "--debug"]