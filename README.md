# Welcome to your Expo app 👋
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction/).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Firebase Integration

To integrate Firebase into your Expo project, follow these steps:

1. Install Firebase SDK:
   ```bash
   npm install firebase
   ```

2. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click **Add Project** and follow the setup instructions
   - Register a new Web App and obtain your Firebase config object

3. Configure Firebase in your project:
   - Create a new file `firebaseConfig.js` inside the `app/services/` directory
   - Add the following configuration:
   
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID',
   };

## Available Scripts

In the project directory, you can run:

- `npm start` - Starts the development server.
- `npm run android` - Runs the app on an Android emulator or device.

## Learn more

To learn more about developing your project with Expo, check out the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open-source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
- [Expo Forums](https://forums.expo.dev): Discuss and find answers from the community.

## License

This project is licensed under the [MIT License](LICENSE).

