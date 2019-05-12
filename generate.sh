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

source .env

release-notes \
    -format json \
    -github-token ${GITHUB_RELEASE_NOTES_TOKEN} \
    -start-sha fa6d17f400a94068b56b7d0f211f3cc9db290db6 \
    -end-sha f7eb5769c2dc4bc701802da639451d0f6cd56a18 \
    -release-version=1.14 \
    -output /home/jeefy/Code/go/src/github.com/kubernetes/release/cmd/release-notes/relnotes.json