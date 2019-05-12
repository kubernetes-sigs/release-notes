# Copyright 2019 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# We label our stage as ‘builder’
FROM node:latest as ui-builder
COPY package-lock.json ./
COPY package.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN $(npm bin)/ng build --prod --output-path=dist

FROM nginx:alpine
COPY nginx-gzip.conf /etc/nginx/conf.d/
COPY --from=ui-builder /ng-app/dist/ /usr/share/nginx/html/