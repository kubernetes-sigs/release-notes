# We label our stage as ‘builder’
FROM node:latest as ui-builder
COPY package-lock.json ./
COPY package.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN $(npm bin)/ng build --prod --output-path=dist

FROM golang:alpine as bin-builder
WORKDIR /go/src/app
RUN apk add git 
COPY . /go/src/app/ 
RUN go get && \
    go build -o relnotes .

FROM scratch
COPY --from=ui-builder /ng-app/ /app/
COPY --from=bin-builder /go/src/app/relnotes /app/
COPY notes/ /app/notes/
WORKDIR /app
CMD ["./relnotes"]