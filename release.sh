#!/usr/bin/env bash
# Based on `twolfson/foundry` but with no ecosystem system buy-in
# Exit on first error, unset variable, or pipe failure
set -euo pipefail

# Parse our CLI arguments
version="$1"
if test "$version" = ""; then
  echo "Expected a version to be provided to \`release.sh\` but none was provided." 1>&2
  echo "Usage: $0 [version] # (e.g. $0 1.0.0)" 1>&2
  exit 1
fi

# Commit any pending changes
git commit -a -m "Release $version"

# Tag the release
git tag "$version"

# Publish the release to GitHub
git push
git push --tags

# Publish to GitHub pages
npm run publish-to-gh-pages
