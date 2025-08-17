# Copy URL & QR Code Generator Chrome Extension

A powerful Chrome extension that provides quick and easy URL copying with multiple formats, QR code generation, and convenient access methods.

## 🚀 Features

### Core Features
- **Extension Icon Click**: Click the extension icon to quickly copy the current tab's URL
- **Right-Click Context Menu**: Copy URLs with right-click options on any page or link
- **QR Code Generation**: Instantly generate QR codes for any URL for easy mobile sharing
- **Multiple Copy Formats**: 
  - Plain URL
  - Markdown Link `[Title](URL)`
  - HTML Link `<a href="URL">Title</a>`

### Additional Features
- **Copy History**: Keep track of recently copied URLs (configurable)
- **Visual Notifications**: Get feedback when URLs are copied
- **Draggable Floating Button**: Optional floating button that can be positioned anywhere on the page
- **Settings Panel**: Customize behavior and preferences
- **Offline Functionality**: Complete privacy - no data collection, no external requests

## 📥 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Search for "Copy URL & QR Code Generator"
3. Click "Add to Chrome"

### From Source (Developer Mode)
1. Download the latest release or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your toolbar

### Permissions Required
- **activeTab**: To access the current tab's URL and title
- **contextMenus**: To add right-click context menu options
- **storage**: To save user preferences and copy history locally
- **notifications**: To show copy confirmation messages
- **tabs**: To access tab information for URL copying

## 🎯 Usage

### Quick Copy Methods
1. **Extension Icon**: Click the 🔗 icon in the toolbar
2. **Right-Click Menu**: Right-click on any page and select "Copy URL"
3. **Popup Interface**: Click the extension icon to open the popup with more options
4. **Floating Button**: Enable the draggable floating button for quick access

### Copy Formats
- **Plain URL**: `https://example.com`
- **Markdown Link**: `[Page Title](https://example.com)`
- **HTML Link**: `<a href="https://example.com">Page Title</a>`

### QR Code Generation
1. Click the extension icon
2. Click the "QR Code" button
3. QR code is generated instantly for mobile sharing
4. Completely offline - no internet required

## ⚙️ Settings

Access settings by:
1. Right-clicking the extension icon
2. Selecting "Options"
3. Or click the gear icon in the popup

### Customizable Options
- **Copy History Limit**: Set how many recent URLs to remember
- **Default Copy Format**: Choose your preferred format
- **Floating Button**: Enable/disable and reset position
- **Notifications**: Toggle copy confirmations

## 🔒 Privacy & Security

### Privacy-First Design
- ✅ **No Data Collection**: We don't collect, store, or transmit any personal data
- ✅ **Completely Offline**: All functionality works without internet
- ✅ **Local Storage Only**: Settings and history stored locally on your device
- ✅ **No External Requests**: Zero network calls to external services
- ✅ **No Tracking**: No analytics, cookies, or user monitoring

### What We Don't Access
- Browsing history beyond current URL
- Personal information
- Website content or forms
- Location data
- Other tabs or windows (unless actively copying)

## 🛠️ Development

### Building from Source
```bash
# Install dependencies
npm install

# Build QR code library
npm run build-qr

# Validate extension
npm run validate

# Create store package
npm run store-ready
```

### Project Structure
```
copylink/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Page interaction script
├── popup.html/js         # Extension popup
├── options.html/js       # Settings page
├── icons/               # Extension icons
├── lib/                 # Bundled libraries
└── scripts/             # Build and validation tools
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Technical Details

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

### Technologies Used
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external dependencies for core functionality
- **Local QR Generation**: Bundled QR code library for offline use
- **Modern CSS**: Gradient design with smooth animations

### File Sizes
- Total extension: ~60KB
- Core functionality: ~15KB
- QR library: ~25KB
- Icons: ~30KB

## 🎨 Design Philosophy

### User Experience
- **One-Click Operation**: Primary functions accessible in single click
- **Visual Feedback**: Clear confirmations for all actions
- **Consistent Interface**: Clean, modern design across all components
- **Accessibility**: Keyboard navigation and screen reader friendly

### Privacy by Design
- **Minimal Permissions**: Only request what's absolutely necessary
- **Local Processing**: Everything happens on your device
- **Transparent**: Open source code you can inspect
- **User Control**: Full control over data and settings

## 📈 Roadmap

### Current Features
- ✅ URL copying in multiple formats
- ✅ QR code generation
- ✅ Draggable floating button
- ✅ Copy history
- ✅ Right-click context menu
- ✅ Privacy-focused design

### Planned Features
- 🔄 Custom keyboard shortcuts
- 🔄 Bulk URL operations
- 🔄 Additional copy formats
- 🔄 Import/export settings
- 🔄 Themes and customization

## 🤝 Support

### Getting Help
- **Issues**: Report bugs via [GitHub Issues](https://github.com/AbhishekBadar/copylink-chromeextension/issues)
- **Discussions**: Feature requests and questions welcome
- **Documentation**: Check this README and included guides

### Common Issues
- **Extension not working**: Check if developer mode is enabled
- **Permissions error**: Ensure all required permissions are granted
- **Copy not working**: Check if notifications are enabled in browser

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- QR code generation powered by [soldair/qrcode](https://github.com/soldair/node-qrcode)
- Icons and design inspired by modern Chrome extension guidelines
- Built with privacy and user experience as top priorities

---

**Made with ❤️ for productivity and privacy**

*Copy URL & QR Code Generator - Making link sharing effortless and secure*
