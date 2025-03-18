# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# ScreenApp Plugin Integration

This project demonstrates the integration of the ScreenApp Plugin, a professional-grade video and audio recorder that can be embedded directly into a website or application.

## Features

- Professional-grade video and audio recording
- Automatic uploads to ScreenApp account for processing
- Transcription and analysis capabilities
- White-labeling and custom branding options

## Installation

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

## How It Works

The application uses the ScreenApp Plugin (v6.22.0) to provide recording capabilities. When a user enters their token and clicks the "Start Recording" button, the plugin is initialized and mounted to the specified container. After recording is completed, the callback function is executed, providing the recording ID and URL.

## Implementation Details

- The plugin is loaded from `https://screenapp.io/app/plugin-latest.bundle.js`
- Users need to enter their own ScreenApp plugin token in the input field
- Recordings are automatically uploaded to the associated ScreenApp account
- The implementation follows the official ScreenApp Plugin integration guide

## Configuration

The application is set up to use the latest version of the ScreenApp plugin. If you need to use a specific version instead, you can update the script source in the `index.html` file:

```html
<!-- For users who want automatic updates (current implementation) -->
<script
  charset="UTF-8" type="text/javascript"
  src="https://screenapp.io/app/plugin-latest.bundle.js">
</script>

<!-- For users who want a specific version -->
<script
  charset="UTF-8" type="text/javascript"
  src="https://screenapp.io/app/plugin-6.22.0.bundle.js">
</script>
```

## Security & Compatibility

- The unique plugin token restricts usage to authorized domains only
- The plugin maintains backward compatibility with all previous versions
- Version 6.22.0 is the latest stable release with all features and security updates
