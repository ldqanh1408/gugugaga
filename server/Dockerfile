# Dockerfile for backend (Express.js with Node.js v20)
FROM node:20

WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependencies
COPY /package*.json ./

RUN npm install
RUN npm install -g nodemon
# Copy mã nguồn vào container
COPY . .

# Mở port mà ứng dụng Express đang lắng nghe (thường là port 3000)
EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "run", "dev"]
