---
title: LineageOS on galaxy nexus (GSM / Murago)
author: root4me
date: 03/30/2017
desc: How to install custom ROM on android. Galaxy nexus , Ubuntu
---

#### Unlock the phone

```
adb reboot bootloader
```
Once device has booted up in boot loader mode (Android in surgery screen) run the following to unlock
```
fastboot oem unlock
```
A prompt will appear on the phone warning warranty will be nulled. Using volume up/down, select 'Yes' and accept using power button.

Boot loaded screen will show up again and 'Lock State' should show up as 'Unlocked'

#### Download LeniageOS image

LeniageOS image can be downloaded from https://download.lineageos.org/ . For Galaxy nexus, images can be found under **Google > Galaxy Nexus (GSM) (maguro)** (I am picking maguro because the phone i am flashing is a GSM model)

#### Download TWRP custom recovery

TWRP can be downloaded from https://twrp.me

You need to get device specific version of twrp\*.img. Navigate to https://twrp.me/Devices/ , search for device specific image, drill in and download the image.

Note that I am not using TWRP app for this exercise and instead utilizing fastboot to load recovery image with out having to root the phone. Look for 'Download Links:'; drill in and download the latest \*.img . While i am writing this, latest version is twrp-3.1.0-0-maguro.img


#### Flash LeniageOS onto phone

1.  Boot into bootloadrer
```
adb reboot bootloader
```

2.  Fastboot custom recovery
```
fastboot boot ~/devtools/androidroot/twrp-3.0.2-0-maguro.img
```
Select 'Read only' from the one time prompt you will see regarding permission to update partition

3.  From TWPR main menu **Wipe -> Format Data**
Do not reboot once this is complete. Instead navigate back to TWPR Main menu

4.  From TWPR main menu **Advanced -> ADB Sideload -> swipe to start Sideload**

5.  Run following command (after replacing the path with location where you have saved leniageOS zip) to flash
```
adb sideload ~/devtools/androidroot/lineage-13.0-20170401-nightly-maguro-signed.zip
```
You should see progress indication for % transfer in terminal. Once terminal indicates that transfer is complete, phone should indicate that the script is successful. Choose to reboot the device at this point.
If things have gone fine so far; you should see leniageOS boot animation show up as the phone reboots. It will take a while (minutes) for the installation to complete.
