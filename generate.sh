source .env

release-notes \
    -format json \
    -github-token ${GITHUB_RELEASE_NOTES_TOKEN} \
    -start-sha fa6d17f400a94068b56b7d0f211f3cc9db290db6 \
    -end-sha f7eb5769c2dc4bc701802da639451d0f6cd56a18 \
    -output /home/jeefy/Code/go/src/github.com/kubernetes/release/cmd/release-notes/relnotes.json