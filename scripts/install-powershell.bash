#!/bin/bash

# Install obsolete public key
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 62D54FD4003F6525

# 1. Update the list of products and download the Microsoft repository GPG keys
wget -q "https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb"

# 2. Register the Microsoft repository GPG keys
sudo dpkg -i packages-microsoft-prod.deb

# 3. Delete the file you just downloaded (cleanup)
rm packages-microsoft-prod.deb

# 4. Update the package list and install PowerShell
sudo apt-get update
sudo apt-get install -y powershell


# Download and run the official Microsoft installation script
# curl -sSL https://aka.ms/install-powershell.ps1 | sudo pwsh -Command - 2>/dev/null || \
# curl -sSL https://aka.ms/install-powershell.ps1 | bash

# OR

# manual installation of PowerShell

# Download the latest PowerShell tar.gz
# wget https://github.com/PowerShell/PowerShell/releases/download/v7.4.1/powershell-7.4.1-linux-x64.tar.gz

# Create a folder for it
# mkdir ~/powershell

# Extract it
# tar -xvf powershell-7.4.1-linux-x64.tar.gz -C ~/powershell

# Start it
# ~/powershell/pwsh