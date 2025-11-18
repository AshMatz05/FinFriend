# FinFriend

FinFriend is a React Native application that aims to ease expense tracking by using emotion based visualisations 

## Features
- **Record expenses** with amount, category, optional description, editable date, mood emoji, and auto-generated category emoji.
- **Mood prediction** suggests a mood emoji per category based on past entries. Users can override any suggestion.
- **Category emoji mapping** converts categories to themed emojis (food, travel, transport, etc.).
- **Negative history warnings** alert when over 60% of a category’s moods are negative.
- **Insights dashboard** with three word clouds (categories, moods, category emojis) plus “categories you enjoy/regret” stats.
- **Expense history** includes search plus mood and emoji filters for quick lookups.
- **Dark/Light mode** the logo on the home page, and the icon on other pages act as dark and light mode toggles.

## Tech Stack
- Expo + React Native + TypeScript
- React Navigation (bottom tabs)
- Zustand state management with persistence middleware
- AsyncStorage for on-device storage
- react-native-svg for custom word-cloud rendering
- dayjs, nanoid, react-native-modal-datetime-picker, react-native-toast-message


## Running the App
```bash
npm install
npx expo start
```
Use Expo Go or an emulator/simulator to preview the application.

## Required Libraries
Install (already included in `package.json`):
```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-svg react-native-svg-transformer
npm install zustand react-native-toast-message dayjs nanoid react-native-modal-datetime-picker
```

