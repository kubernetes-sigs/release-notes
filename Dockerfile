# We label our stage as ‘builder’
FROM node:latest as ui-builder
COPY package-lock.json ./
COPY package.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN $(npm bin)/ng build --prod --output-path=dist

FROM nginx:alpine
COPY --from=ui-builder /ng-app/dist/ /usr/share/nginx/html/