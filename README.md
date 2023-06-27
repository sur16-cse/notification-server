# Firebase push notification sdk backend 
- mvc structure
- register token on firebase
- duplicate token detected 
- send  push notification messages to multiple devices
- updateToken status with timestamp 
- send push notification to only those user which is active

# package used 
- express
- firebase-admin
- body-parser

## Credentials
- Set up a Firebase Service Account that lets the Firebase Admin SDK authorize calls to FCM APIs. Open the Project Settings in the Firebase console and select the Service accounts tab. Choose ‘NodeJs' and click Generate new private key to download the configuration snippet.