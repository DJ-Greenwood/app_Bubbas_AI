# Assets Directory

This directory contains all static assets for the application.

## Structure

- `images/` - For image files (PNG, JPG, SVG, etc.)
- `fonts/` - For custom font files
- `icons/` - For icon files
- `styles/` - For global stylesheets if needed

## Usage

Import assets in your components like this:

```jsx
import logo from '../assets/images/logo.png';

const Header = () => (
  <img src={logo} alt="Company Logo" />
);
```
