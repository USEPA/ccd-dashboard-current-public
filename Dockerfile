FROM ghcr.io/usepa/node-20:latest

WORKDIR /dashboard/

# COPY ./package.json
# insufficient, gives TypeError: Cannot read property 'options' of undefined
# in build / dev stages
COPY . .

SHELL ["bash", "-c"]

# extra pacakges needed to run Cypress
RUN yarn install \
   # localhost -> 0.0.0.0, don't just listen on localhost
   && sed -i "s/host: 'localhost',/host: '0.0.0.0',/" nuxt.config.js \
   && yarn build

EXPOSE 8001

# CMD ["yarn", "dev"]
CMD ["yarn", "start"]
