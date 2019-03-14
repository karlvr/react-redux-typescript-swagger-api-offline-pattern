#!/bin/bash -eu
#
# Generates the TypeScript Fetch API for our Swagger configuration

basedir=$(dirname $0)
destdir=gen/api
swagger="${1:-}"

if [ -z "$swagger" ]; then
	echo "usage: $0 <swagger URL>" >&2
	exit 1
fi

# Clean first
rm -rf "$destdir"

# Generate the API
openapi-generator generate -i "$swagger" -g typescript-fetch -o "$destdir" -c $basedir/../etc/api.json

# Detect npm or yarn
npm_or_similar=npm

cat > $destdir/.gitignore <<EOF
node_modules
EOF

# Build the API
pushd "$destdir"
$npm_or_similar install
# We need to include the url module explicitly to support running on React Native
#npm install --save url
popd

# Yarn doesn't symlink the package into node_modules
if [ "$npm_or_similar" == "yarn" ]; then
	$npm_or_similar upgrade typescript-fetch-api
fi
