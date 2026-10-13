#!/usr/bin/env bash
# Build a frontend WAR for deploying to a Dataverse (Payara) instance.
# Also used by the GitHub Actions workflows that build and deploy the WAR.
#
# Usage: scripts/build-war.sh [--install] [--base <path>] [--version <v> | --tag <tag>]
#
#   --install        Run `npm ci` first (needed on a fresh clone; requires .npmrc).
#   --base <path>    Base path the frontend is served from, e.g. /modern or /
#                    (default: the base in vite.config.ts, currently /modern).
#   --version <v>    Maven version recorded in the WAR's metadata (default: local).
#   --tag <tag>      Build from a git tag (e.g. v0.4.0) in a temporary worktree,
#                    leaving the current checkout untouched. Always runs `npm ci`.
#
# Environment:
#   DATAVERSE_BACKEND_URL  Backend URL written to config.js
#                          (default when unset: http://localhost:8080)
#   OIDC_*                 Optional OIDC overrides; see scripts/write-runtime-config.mjs
#
# Output:
#   deployment/payara/target/dataverse-frontend.war        (current checkout)
#   deployment/payara/target/dataverse-frontend-0.4.0.war  (--tag v0.4.0)

set -euo pipefail
cd "$(dirname "$0")/.."
repo_root="$PWD"

install=false
base=""
maven_version=""
tag=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --install) install=true; shift ;;
    --base)
      [[ $# -ge 2 ]] || { echo "--base requires a value" >&2; exit 1; }
      base="$2"; shift 2 ;;
    --version)
      [[ $# -ge 2 ]] || { echo "--version requires a value" >&2; exit 1; }
      maven_version="$2"; shift 2 ;;
    --tag)
      [[ $# -ge 2 ]] || { echo "--tag requires a value" >&2; exit 1; }
      tag="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -n "$tag" && -n "$maven_version" ]]; then
  echo "--version can't be combined with --tag, which sets the version" >&2
  exit 1
fi

# Default only when unset. In CI an empty secret comes through as an empty
# string, and write-runtime-config.mjs then keeps backendUrl from public/config.js.
export DATAVERSE_BACKEND_URL="${DATAVERSE_BACKEND_URL-http://localhost:8080}"

# Build the WAR in the given source tree with the given Maven version.
build_war() {
  local src="$1" version="$2"
  (
    cd "$src"

    if [[ "$install" == true ]]; then
      # The design system is an npm workspace, so one install at the root covers both.
      npm ci
    fi

    npm --prefix packages/design-system run build

    if [[ -n "$base" ]]; then
      npm run build -- --base="$base"
    else
      # The /modern base path comes from vite.config.ts.
      npm run build
    fi

    # Override the backend URL (and any OIDC settings) in dist/config.js.
    node scripts/write-runtime-config.mjs

    mvn -f deployment/payara/pom.xml clean package -Dversion="$version"
  )
}

if [[ -z "$tag" ]]; then
  build_war "$repo_root" "${maven_version:-local}"
  exit 0
fi

git rev-parse --verify --quiet "refs/tags/$tag" >/dev/null || {
  echo "Tag not found: $tag (try git fetch --tags)" >&2
  exit 1
}

# Tags are named like v0.4.0, but the WAR filename and Maven version use the
# bare number (dataverse-frontend-0.4.0.war, -Dversion=0.4.0), matching the
# "version" field in package.json. ${tag#v} removes a single leading "v".
version="${tag#v}"
worktree="$(mktemp -d)"
cleanup() { git -C "$repo_root" worktree remove --force "$worktree" || true; }
trap cleanup EXIT

git worktree add --detach "$worktree" "$tag"
if [[ -f .npmrc ]]; then
  cp .npmrc "$worktree/"
fi

# A fresh worktree has no node_modules. HUSKY=0 keeps the prepare script
# from touching the shared git hooks config.
(cd "$worktree" && HUSKY=0 npm ci)
install=false

# Make the footer show the version and commit, e.g. 0.4.0-a9b263034.
#
# build/spaVersionMetadata.mjs shows package.json's version only when it
# matches the tag, and otherwise shows just the commit SHA. Checking out a tag
# leaves HEAD detached, so it can't see the tag on its own; it does honor the
# GitHub Actions ref variables. So, in this throwaway worktree only, set the
# package.json version to <version>-<sha> and pass a matching tag name.
commit="$(git rev-parse "$tag^{commit}" | cut -c1-9)"
display_version="$version-$commit"
# (Not `npm pkg set`, which rejects our object-style "workspaces" field.)
(cd "$worktree" && DISPLAY_VERSION="$display_version" node -e '
  const fs = require("fs")
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
  pkg.version = process.env.DISPLAY_VERSION
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n")
')
GITHUB_REF_TYPE=tag GITHUB_REF_NAME="$display_version" build_war "$worktree" "$version"

mkdir -p deployment/payara/target
cp "$worktree/deployment/payara/target/dataverse-frontend.war" \
  "deployment/payara/target/dataverse-frontend-$version.war"
echo "Built deployment/payara/target/dataverse-frontend-$version.war"
