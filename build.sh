# rm -rf dist
# cp -r src dist
babel src/server -d dist "$@" --source-maps --ignore src/test/fixtures
