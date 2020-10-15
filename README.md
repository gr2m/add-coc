# add-coc

This is a script for [mutate-github-repositories-cli](https://github.com/gr2m/mutate-github-repositories-cli/).

You can use it to add a `CODE_OF_CONDUCT.md` file to many repositories at the same time.

## Usage

```
git clone https://github.com/gr2m/add-coc.git
cd add-coc
$ npx mutate-github-repositories-cli \
  --token 0123456789012345678901234567890123456789 \
  script.js \
  "octokit/*"
```

## Licenses

[ISC](LICENSE.md)
