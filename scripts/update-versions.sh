#!/bin/bash

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: Version argument is required"
  echo "Usage: $0 <version>"
  exit 1
fi

echo "Updating sub-packages to version $VERSION..."

# Find all package.json files in subdirectories (excluding root and node_modules)
# and run npm version in each directory
find . -mindepth 2 -maxdepth 2 -name 'package.json' -not -path '*/node_modules/*' | while read -r package_path; do
  package_dir=$(dirname "$package_path")
  echo "Updating $package_dir/package.json to version $VERSION"
  (cd "$package_dir" && npm version "$VERSION" --git-tag-version=false --allow-same-version)
done

echo "All sub-packages updated successfully!"
