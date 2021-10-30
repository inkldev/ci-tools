#!/usr/bin/env bash

: ==========================================
: Introduction
: ==========================================

# This script is greatly inspired by the Firebase CLI install script
# which you can find at: https://firebase.tools/

: ==========================================
: Source Code
: ==========================================

# Convenience function
panic() {
  echo "❌ Error: $1"
  exit 1
}

# Make sure that the Github Personal Access Token was provided

if [ -z "$CI_TOOLS_TOKEN" ]; then
  panic "environment variable 'CI_TOOLS_TOKEN' is not set"
fi

# For info about why we place the binary at this location, see
# https://unix.stackexchange.com/a/8658
INSTALL_DIR="/usr/local/bin"

# In order for the user to be able to actually run the "ci-tools" command
# without specifying the absolute location, the INSTALL_DIR path must
# be present inside of the PATH environment variable.

echo "🛠 Checking the PATH variable..."
if [[ ! ":$PATH:" == *":$INSTALL_DIR:"* ]]; then
  panic "
    It looks like $INSTALL_DIR isn't on your PATH.
    Please add the following line to either your ~/.profile or ~/.bash_profile, then restart your terminal.

    PATH=\$PATH:$INSTALL_DIR

    For more information about modifying PATHs, see https://unix.stackexchange.com/a/26059
  "
fi

# We need to ensure that the INSTALL_DIR exists.
sudo mkdir -p "$INSTALL_DIR"

echo "💻 Checking the machine type..."

# We use "tr" to translate the uppercase "uname" output into lowercase
UNAME=$(uname -s | tr '[:upper:]' '[:lower:]')

if [ "$UNAME" != "linux" ]; then
  panic "this operating system is not supported"
fi

BIN_FILE="$INSTALL_DIR/ci-tools"

# We need to get the ID of the latest binary asset so that
# we can generate a download link accessible via REST API

LATEST_RELEASE_URL="https://api.github.com/repos/inkldev/ci-tools/releases/latest"
ASSET_ID=$(curl -H "Authorization: token $CI_TOOLS_TOKEN" "$LATEST_RELEASE_URL" | jq .assets[0].id)
ASSET_URL="https://api.github.com/repos/inkldev/ci-tools/releases/assets/$ASSET_ID"

echo "📥 Downloading binary from $ASSET_URL"
sudo curl "$ASSET_URL" \
  --output "$BIN_FILE" \
  --header "Authorization: token $CI_TOOLS_TOKEN" \
  --header 'Accept: application/octet-stream' \
  --location \
  --progress-bar

# Once the download is complete, we mark the binary file as readable
# and executable (+rx).
echo "🔑 Setting permissions on binary..."
sudo chmod +rx "$BIN_FILE"

# Get the version to test if the command has been successfully installed
VERSION=$(ci-tools --version)

# If no version is detected then clearly the binary failed to install for some reason
if [ -z "$VERSION" ]; then
  panic "failed to get binary version"
fi

# Since we've gotten this far we know everything succeeded. We'll just
# let the developer know everything is ready and take our leave.
echo "-- ✅ ci-tools v$VERSION is now installed"
echo "-- 🎉 All Done!"

exit 0
