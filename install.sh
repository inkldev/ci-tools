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


# If version was not given, default to latest version
if [ -z "$CI_TOOLS_VERSION" ]; then
  RELEASE_URL="https://github.com/inkldev/ci-tools/releases/latest/download/ci-tools"
else
  RELEASE_URL="https://github.com/inkldev/ci-tools/releases/download/v$CI_TOOLS_VERSION/ci-tools"
fi

BIN_FILE="$INSTALL_DIR/ci-tools"

echo "📥 Downloading binary from '$RELEASE_URL' to '$BIN_FILE'"
sudo curl "$RELEASE_URL" \
  --output "$BIN_FILE" \
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
echo "✅ ci-tools v$VERSION is now installed"
echo "🎉 All Done!"

exit 0
