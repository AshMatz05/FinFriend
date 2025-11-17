# FinFriend

FinFriend is a React Native (Expo) application for logging expenses, tagging emotions, and surfacing insights with emoji-driven visualizations.

## Features
- **Record expenses** with amount, category, optional description, editable date, mood emoji, and auto-generated category emoji.
- **Mood prediction** suggests a mood emoji per category based on past entries (most frequent mood wins). Users can override any suggestion.
- **Category emoji mapping** converts categories/descriptions to themed emojis (food, travel, transport, etc.) with a 💰 fallback.
- **Negative history warnings** alert when over 60% of a category’s moods are negative.
- **Insights dashboard** with three word clouds (categories, moods, category emojis) plus “categories you enjoy/regret” stats.
- **Expense history** includes search plus mood and emoji filters for quick lookups.
- **Persistence** powered by Zustand + AsyncStorage; derived stats are rebuilt automatically on load.
- **Toast confirmations** appear after each save to provide instant feedback.

## Tech Stack
- Expo + React Native + TypeScript
- React Navigation (bottom tabs)
- Zustand state management with persistence middleware
- AsyncStorage for on-device storage
- react-native-svg for custom word-cloud rendering
- dayjs, nanoid, react-native-modal-datetime-picker, react-native-toast-message

## Project Structure
```
.
├── App.tsx
├── declarations.d.ts             # SVG typings
├── src
│   ├── components                # Emoji selector, expense form, word cloud
│   ├── hooks                     # Word cloud data hook
│   ├── navigation                # Tab navigator
│   ├── screens                   # Home, Add Expense, History, Insights
│   ├── store                     # Zustand store + TypeScript models
│   ├── theme.ts                  # Design tokens
│   └── utils                     # Emoji mapping + statistics helpers
└── README.md
```

## State & Logic
### Mood Prediction
`buildMoodStats` tallies positive/neutral/negative counts for each category. `getPredictedMood(category)` returns whichever count is highest (defaulting to neutral when no data exists). The add-expense flow calls this helper whenever the user leaves the selector untouched.

### Warning Logic
`shouldWarn(category)` checks the category’s mood stat totals; if more than 60% of entries are negative, an alert is presented before saving.

### Category Emoji Mapping
`getCategoryEmoji(category, description?)` scans category/description text for keyword matches (restaurant, groceries, travel, bills, medical, etc.) and returns the associated emoji. If no keywords match, the function returns 💰.

### Word Clouds
`useWordCloudData` produces three datasets:
- **Categories:** frequency counts per category name.
- **Moods:** total counts for positive/neutral/negative moods.
- **Category emojis:** counts drawn from `categoryEmojiStats`.

These datasets feed the `WordCloud` component, which draws text using `react-native-svg` with font sizes scaled by frequency.

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

