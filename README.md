# Glow Track  App 👋

This is a mobile app for Glow Track , a learning management system for schools and educational institutions. The app is built with [Expo](https://expo.dev/), a platform for universal React applications.

## Pre-requisites
- Node.js
- Yarn (4.4.0 or higher)

## References
- [Expo Router (File-based router)](https://docs.expo.dev/router/introduction/) 
- [Tamagui](https://tamagui.dev/) 
- [React Query](https://tanstack.com/query/v3/docs/framework/react/overview)
 
## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   yarn start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Translations
- Add new translations to files: `i18n/locales/en.json` and `i18n/locales/vi.json`

```json
// example
{
  "hello": "Hello",
  "home": {
    "title": "Home",
    "greeting": "Hello, {{name}}!",
  }
}
```

- Use translations in components

```tsx
// example
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return {
    <>
      <Text>{t('Hello')}</Text> // Hello
      <Text>{t('home.title')}</Text> // Home
      <Text>{t('greeting', { name: "John" })}</Text> // Hello, John!
    </>
  };
}
```
## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
