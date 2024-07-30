FROM node:latest

WORKDIR /react-app

COPY public/ /react-app/public

COPY src/ /react-app/src

COPY package.json /react-app/

RUN npm install

EXPOSE 3000

CMD ["/bin/bash"]

# This code was adapted from 'Dockerfile' in the 'React_Node_MySql' repository by Sandiecodes
# GitHub Repository: https://github.com/Sandiecodes/React_Node_MySql/blob/main/Dockerfile
# Accessed on 11/01/2023
