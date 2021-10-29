#!/usr/bin/env bash

: ==========================================
:   Introduction
: ==========================================

# This script is greatly inspired by the Firebase CLI install script
# which you can find at: https://firebase.tools/

: ==========================================
:   Source Code
: ==========================================

# For info about why we place the binary at this location, see
# https://unix.stackexchange.com/a/8658
INSTALL_DIR="/usr/local/bin"

# We need to ensure that the INSTALL_DIR exists.
sudo mkdir -p "$INSTALL_DIR"

echo "-- Checking your machine type..."

# We use "tr" to translate the uppercase "uname" output into lowercase
UNAME=$(uname -s | tr '[:upper:]' '[:lower:]')

if [ "$UNAME" != "linux" ]
then
    echo "Error: This operating system is not supported"
    exit 1
fi

# TODO: Installation