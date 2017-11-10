# rm -rf dist
# cp -r src dist
babel src/server -d dist/src/server "$@" --source-maps --ignore src/test/fixtures
