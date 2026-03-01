# Internationalization (i18n) System

This project uses a custom i18n system to support multiple languages (Vietnamese and English).

## File Structure

```
src/i18n/
├── I18nContext.js          # Context provider and custom hook
├── index.js                # Re-exports
└── translations/
    ├── vi.json            # Vietnamese translations
    └── en.json            # English translations
```

## How to Use

### 1. In React Components

Use the `useI18n` hook to access translations:

```javascript
import { useI18n } from '../i18n';

function MyComponent() {
  const { t, language, toggleLanguage } = useI18n();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>Current language: {language}</p>
      <button onClick={toggleLanguage}>
        Switch to {language === 'vi' ? 'English' : 'Vietnamese'}
      </button>
    </div>
  );
}
```

### 2. Translation Keys

Translation keys are organized in a hierarchical structure. Use dot notation to access nested translations:

```javascript
t('nav.home')              // Gets nav.home from translation file
t('common.loading')        // Gets common.loading
t('admin_table.orderId')   // Gets admin_table.orderId
```

## Features

- ✅ Vietnamese (vi) as default language
- ✅ English (en) support
- ✅ Persistent language preference (localStorage)
- ✅ Language switcher component
- ✅ Fallback values for missing translations
- ✅ Automatic document language attribute update

## Adding New Translations

1. Add the key-value pair to both `vi.json` and `en.json`:

**vi.json:**
```json
{
  "mySection": {
    "myKey": "Giá trị tiếng Việt"
  }
}
```

**en.json:**
```json
{
  "mySection": {
    "myKey": "English value"
  }
}
```

2. Use it in your component:
```javascript
const { t } = useI18n();
const text = t('mySection.myKey');
```

## Supported Sections

- `nav` - Navigation items
- `home` - Home page
- `shop` - Shop page
- `product` - Product details
- `cart` - Cart page
- `checkout` - Checkout page
- `auth` - Authentication pages
- `orders` - Orders pages
- `profile` - Profile page
- `contact` - Contact page
- `admin` - Admin pages
- `admin_table` - Admin table headers
- `common` - Common labels and buttons

## Language Switcher

The `LanguageSwitcher` component is displayed in the header and allows users to toggle between languages.

```javascript
import LanguageSwitcher from '../components/common/LanguageSwitcher';

// Use in your component
<LanguageSwitcher />
```

## API

### useI18n Hook

```javascript
const { language, setLanguage, toggleLanguage, t } = useI18n();

// language: current language ('vi' or 'en')
// setLanguage: function to set language directly
// toggleLanguage: function to toggle between languages
// t: translation function - t(key, defaultValue)
```

## Notes

- Default language is Vietnamese ('vi')
- Language preference is saved in localStorage under the 'language' key
- The document's `lang` attribute is automatically updated
- Missing translations fall back to the provided key or default value
