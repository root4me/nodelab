---
title: Prerequisites for installing custom ROM
author: root4me
date: 03/18/2017
desc: How to install custom ROM on android. Galaxy nexus , Ubuntu
---


### Get android sdk

Android studio and Androis sdk are available at  https://developer.android.com/studio/index.html .
Either download Android studio or the command line tools package. Two utilities that are needed during custom ROM installation are adb and fastboot which belong to platform tools package. So, after you download android studio or command line tools, run sdkmanager and install platform tools.

#### Set up system to detect phone over USB

1.  Include device specific rules in 51-android.rules
```
sudo vim /etc/udev/rules.d/51-android.rules
```
Append following lines into 51-android.rules
```
SUBSYSTEM=="usb", ATTR{idVendor}=="0b05", MODE="0666", GROUP="plugdev" # ASUS
SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev" # SAMSUNG
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666", GROUP="plugdev" # GOOGLE
```
In my case, I intend to work with devices from google , samsung and Asus and hence I have configured ``` ATTR{idVendor}== ``` for those vendors. You need to insert your vendor specific values instead.Complete list of vendor IDs can be obtained from  https://developer.android.com/studio/run/device.html#VendorIds  

2.  Change permission for 51-android.rules
```
sudo chmod a+r /etc/udev/rules.d/51-android.rules
```

#### Enable USB debugging in phone

1.  Navigate to phones' **Settings > About phone** and tap **Build number** seven time.
It is rather funny that anyone can become a developer by tapping a setting few times. So, smile while you are at it.  

2.  Navigate to **Settings > Developer options** and enable **Android debugging** under **Debugging** section. This will allow interaction between your system and phone via adb (Android Debug Bridge)

#### Add platform tools to $PATH

1.  Open a terminal and check if $PATH includes android sdk directory.
```
$PATH
```
2.  Edit .profile and add android-sdk platform-tools direcotry into PATH   
I have installed sdk under ~/devtools/android-sdk
```
vim ~/.profiles
```
Add the following to PATH
```
$HOME/devtools/android-sdk/platform-tools
```
Final version of .profile will have the last two lines look something like the following
```
# set PATH so it includes user's private bin directories
PATH="$HOME/bin:$HOME/.local/bin:$HOME/devtools/android-sdk/platform-tools:$PATH"
```
Reload .profile after saving changes
```
source ~/.profile
```

#### Test adb connection with phone

1.  Connect the phone to your system via USB cable
2.  Run adb command from terminal
```
adb devices
```
First time you make this connection, the phone will prompt you with an alert asking for permission to debug from this computer (along with an RSA key). Check '**Always allow from this computer**' and accept.  
Run ``` adb devices ``` again and you should see response similar to following
```
List of devices attached
0149C7A51200E00A	device
```
If you see the command return device ID with a name of **device** , you are set. If the command does not return any device or it return ID with a name of 'unauthorized', you will need to troubleshoot.
