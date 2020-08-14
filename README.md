# Project Title:

DSR Management.

# Getting Started:

Setting up and installing this software is easy by just installing Ionic, Cordova, Android SDKs.

# Prerequisites:

**Softwares needed:**
1.	Ionic v3.9.2.
2.	Cordova v8.0.0.
3.	NodeJS v8.11.4.
3.	Android Studio.
4.	Android SDKs (from Android KitKat to Android P).
5.  Web Server (to store PHP files and MySQL database).

# Installing required softwares:
1.	NodeJS: https://nodejs.org/dist/v8.11.4/
2.	Android Studio: https://developer.android.com/studio/

**For Windows users:**
1.	Download NodeJS & Android Studio from the provided download links.
2.	Open Command Prompt in Administrator mode and then execute the following commands to install Ionic & Cordova using npm:
		npm install -g ionic@3.9.2 cordova@8.0.0
3.	Then open Android Studio and open the Settings menu.
4.	In the Settings menu, select the 'Android SDK' option in the left pane.
5.	Check all the options from Android KitKat to Android P to download all the Android SDKs required for the generation of APK.
6.  Go to you web server and then start 'PHPMyAdmin' and then create a MySQL database with name 'dsr' and them import the 'dsr.sql' file into the database. This will create the required database tables on your web server.
7.  Next, move all the files from the 'php' folder to your web server. The PHP files will manage the back-end part of the app.
8.  Change all the URLs of the PHP files in the project's 'src' folder to your web server's URL. If you don't change the URL, then the app won't work as expected.

**For Ubuntu/Debian users:**
1.	Download NodeJS & Android Studio from the provided download links.
2.	Open the terminal and then execute the following commands to install Ionic & Cordova using npm:
		npm install -g ionic@3.9.2 cordova@8.0.0
3.	Then open Android Studio and open the Settings menu.
4.	In the Settings menu, select the 'Android SDK' option in the left pane.
5.	Check all the options from Android KitKat to Android P to download all the Android SDKs required for the generation of APK.
6.  Go to you web server and then start 'PHPMyAdmin' and then create a MySQL database with name 'dsr' and them import the 'dsr.sql' file into the database. This will create the required database tables on your web server.
7.  Next, move all the files from the 'php' folder to your web server. The PHP files will manage the back-end part of the software.
8.  Change all the URLs of the PHP files in the project's 'src' folder to your web server's URL. If you don't change the URL, then the app won't work as expected.

**Following the above installation steps for required softwares will set up an environment to run the DSR Management software without any hassles.**

**Running the software:**
**For Windows users:**
1.	For running the software, we need to install all the required dependencies for the software. This can be done by executing the following command in Command Prompt in Administrator mode in the project's directory:
		  
        npm install
2.	After the installation of all the dependencies is completed, run the project by executing the following command in Command Prompt in the project's directory:
		
        ionic serve

**For Ubuntu/Debian users:**
1.	For running the software, we need to install all the required dependencies for the software. This can be done by executing the following command in the terminal in the project's directory:
		
        npm install
2.	After the installation of all the dependencies is completed, run the project by executing the following command in terminal in the project's directory:
		
        ionic serve
		
**To generate APK of the project:**
**For Windows users:**
1.	Make sure that you have downloaded Android Studio and have also downloaded all the required Android SDKs for the generation of APK.
2.	Open your Command Prompt in Administrator mode and navigate to the project's directory. Then execute the following commands:
	ionic cordova platform add android
	ionic cordova build android
3.	After the process is completed, the generated APK can be found by the name of 'apk-debug.apk' at the following location:
	<Project directory's path>/platforms/android/app/build/outputs/apk

**For Ubuntu/Debian users:**
1.	Make sure that you have downloaded Android Studio and have also downloaded all the required Android SDKs for the generation of APK.
2.	Open your terminal and navigate to the project's directory. Then execute the following commands:
	ionic cordova platform add android
	ionic cordova build android
3.	After the process is completed, the generated APK can be found by the name of 'apk-debug.apk' at the following location:
	<Project directory's path>/platforms/android/app/build/outputs/apk

# Built with:

1.	Ionic Framework - A framework for hybrid mobile app development.
2.	Cordova - A mobile application development framework.

# Author:

    Siddhesh Kudtarkar
