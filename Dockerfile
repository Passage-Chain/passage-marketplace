# FROM ubuntu:22.04

# RUN apt-get update && apt-get install -y nginx

# RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
# RUN apt-get update && apt-get install -y nodejs npm

# WORKDIR /usr/local/frontend
# # Truly weird syntax, but adds all the files in local to the container
# ADD . / ./
# RUN npm install
# RUN npm run build

# ADD server.conf /etc/nginx/conf.d/server.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

###########################################################################

# Stage 1
FROM node:16.13.0 as react-build
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY server.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]