# CopyLink Chrome Extension

A powerful Chrome extension that provides quick and easy URL copying with multiple formats and convenient access methods.

## Features

### Core Features
- **Extension Icon Click**: Click the extension icon to quickly copy the current tab's URL
- **Right-Click Context Menu**: Copy URLs with right-click options on any page or link
- **Multiple Copy Formats**: 
  - Plain URL
  - Markdown Link `[Title](URL)`
  - HTML Link `<a href="URL">Title</a>`

### Additional Features
- **Copy History**: Keep track of recently copied URLs (configurable)
- **Visual Notifications**: Get feedback when URLs are copied
- **Draggable Floating Button**: Optional floating button that can be positioned anywhere on the page
- **Settings Panel**: Customize behavior and preferences
- **Copy Title + URL**: Option to copy both page title and URL together

## Installation

### From Source (Developer Mode)
1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The CopyLink extension should now appear in your toolbar

### Permissions Required
- **activeTab**: To access the current tab's URL and title
- **contextMenus**: To add right-click context menu options
- **storage**: To save user preferences and copy history

## Usage

### Quick Copy Methods
1. **Extension Icon**: Click the 📋 icon in the toolbar
2. **Right-Click Menu**: Right-click on any page and select "Copy URL"
3. **Popup Interface**: Click the extension icon to open the popup with more options

### Copy Formats
- **Plain URL**: `https://example.com`
- **Markdown Link**: `[Page Title](https://example.com)`
- **HTML Link**: `<a href="https://example.com">Page Title</a>`
- **Title + URL**: 
  ```
  Page Title
  https://example.com
  ```

### Floating Button
The floating copy button provides these features:
- **Draggable**: Click and drag to position anywhere on the page
- **Position Memory**: Remembers your preferred position across page loads
- **Visual Feedback**: Scales and changes shadow when being dragged
- **Reset Position**: Use the settings page to reset to default position

### Settings
Access settings by:
1. Click the extension icon to open the popup
2. Click "Settings" at the bottom
3. Or right-click the extension icon and select "Options"

**Available Settings:**
- Default copy format
- Enable/disable notifications
- Show/hide floating copy button
- Enable/disable copy history
- Set maximum history items
- Reset floating button position

## File Structure

```
copylink/
├── manifest.json          # Extension manifest
├── background.js          # Service worker for context menus and background tasks
├── content.js            # Content script for page interaction
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── options.html          # Settings page
├── options.js            # Settings functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Development

### Prerequisites
- Chrome browser
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension APIs

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the CopyLink extension card
4. Test your changes

### Adding New Features
The extension is built with a modular structure:
- **Background Script**: Handle context menus, notifications, and storage
- **Content Script**: Handle page-level interactions and floating elements
- **Popup**: Provide rich interface for copying and history
- **Options**: Settings and preferences management

## Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Edge**: Should work with Chrome extensions support
- **Firefox**: Would require minor modifications for Manifest V2

## Privacy

This extension:
- ✅ Only accesses the current tab when you use it
- ✅ Stores settings and history locally in your browser
- ✅ Does not send any data to external servers
- ✅ Does not track your browsing activity
- ✅ Open source - you can review all code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Changelog

### Version 1.0.0
- Initial release
- Basic URL copying functionality
- Context menu integration
- Multiple copy formats
- Copy history
- Settings panel
