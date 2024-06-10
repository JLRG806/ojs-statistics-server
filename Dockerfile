FROM node@sha256:6937be95129321422103452e2883021cc4a96b63c32d7947187fcb25df84fc3f

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Exports
EXPOSE 8000

CMD ["npm","start"]