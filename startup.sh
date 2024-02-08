#!/bin/sh

# start the server
npm run start
sleep 1

# run migrations
npx sequelize-cli db:migrate