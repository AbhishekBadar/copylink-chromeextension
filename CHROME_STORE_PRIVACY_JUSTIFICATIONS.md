# Chrome Web Store Privacy & Justification Statements

## 📋 Single Purpose Statement

**Single Purpose**: This extension enables users to quickly copy webpage URLs in multiple formats (plain text, Markdown, HTML) and generate QR codes for easy mobile sharing, enhancing productivity for developers, content creators, and professionals who frequently share links across devices.

---

## 🔐 Permission Justifications

### Required Permissions in manifest.json:
```json
"permissions": [
  "activeTab",
  "contextMenus", 
  "storage",
  "notifications",
  "tabs"
]
```

### Detailed Justification for Each Permission:

#### 1. **activeTab**
**Purpose**: Access the current active tab to read the URL and page title
**Justification**: Essential for the core functionality of copying the current page's URL. This permission allows the extension to read the URL and title of the currently active tab when the user clicks the extension button or uses the context menu. Without this permission, the extension cannot fulfill its primary purpose of copying URLs.
**User Benefit**: Enables one-click URL copying from any webpage

#### 2. **contextMenus**
**Purpose**: Add "Copy URL" options to the right-click context menu
**Justification**: Provides users with convenient access to URL copying functionality through right-click menus on any webpage. This enhances user experience by offering multiple ways to access the core functionality without requiring toolbar interaction.
**User Benefit**: Quick access to copy functionality via right-click menu

#### 3. **storage**
**Purpose**: Store user preferences, copy history, and floating button position
**Justification**: Necessary to remember user settings such as copy history limits, preferred copy formats, and the position of the draggable floating button. All data is stored locally and never transmitted to external servers.
**User Benefit**: Personalized experience with persistent settings and copy history

#### 4. **notifications**
**Purpose**: Show copy confirmation messages to users
**Justification**: Provides visual feedback when URLs are successfully copied, improving user experience by confirming that the action was completed. These are brief, non-intrusive notifications that appear only when the user performs a copy action.
**User Benefit**: Clear confirmation that URL copying was successful

#### 5. **tabs**
**Purpose**: Access tab information for URL and title retrieval
**Justification**: Required to read the URL and page title from browser tabs to enable the core copying functionality. This permission works in conjunction with activeTab to provide complete URL copying capabilities.
**User Benefit**: Accurate URL and title information for copying in various formats

---

## 🛡️ Privacy Practices Declaration

### Data Collection & Usage

**Data Collection**: NONE
- This extension does not collect, store, or transmit any personal data
- No analytics, tracking, or user behavior monitoring
- No external network requests are made

**Local Storage Only**:
- User preferences (copy format, history limits)
- Copy history (stored locally, user-controlled)
- Floating button position
- All data remains on the user's device

**No External Communications**:
- No data sent to external servers
- No API calls to third-party services
- No tracking pixels or analytics
- Completely offline functionality

### Privacy Policy Statement

**Privacy Policy Required**: NO

**Reason**: This extension does not collect, use, or share any user data. All functionality operates entirely offline using only local browser APIs. No privacy policy is required as per Chrome Web Store guidelines for extensions that do not collect user data.

---

## 🎯 Host Permission Justification

**Host Permissions**: NONE REQUESTED

**Content Scripts**: Used only for displaying the optional floating button
- Runs on `<all_urls>` with `document_idle` timing
- Only injects minimal UI elements
- No data collection or external communication
- User can disable this feature in settings

---

## 📖 Store Listing Declarations

### Single Purpose Compliance
✅ **Narrow Focus**: URL copying and QR code generation only
✅ **Easy to Understand**: Clear functionality described in name and description
✅ **No Feature Creep**: Limited to URL management tasks only

### Permission Justification Summary
✅ **Minimal Permissions**: Only requests permissions essential for core functionality
✅ **Clear Purpose**: Each permission directly supports the stated single purpose
✅ **No Overreach**: No requests for unnecessary browser access

### Privacy Compliance
✅ **No Data Collection**: Zero personal data collection or storage
✅ **Local Operation**: All functionality works offline
✅ **Transparent**: Open about minimal local storage for user preferences

---

## 📝 Copy-Paste Ready Responses

### For "Single Purpose" Field:
```
This extension serves a single, narrow purpose: copying webpage URLs in multiple formats (plain text, Markdown, HTML) and generating QR codes for cross-device sharing. All functionality is focused exclusively on URL management and sharing to enhance productivity for users who frequently work with web links.
```

### For "Permission Justification" Field:
```
activeTab: Required to read the current page URL and title for copying functionality.
contextMenus: Provides right-click menu access to copy features.
storage: Stores user preferences and copy history locally (no external transmission).
notifications: Shows copy confirmation messages to users.
tabs: Enables access to tab information for complete URL copying capabilities.

All permissions directly support the core URL copying and QR generation functionality. No data is collected or transmitted externally.
```

### For "Host Permission Justification" Field:
```
No host permissions requested. Content script is used only to display an optional floating button interface element and does not access page content or make external requests.
```

---

## ✅ Compliance Checklist

- ✅ Single purpose clearly defined and narrow in scope
- ✅ All permissions justified with specific use cases
- ✅ No unnecessary permissions requested
- ✅ Privacy practices clearly documented
- ✅ No data collection or external transmission
- ✅ Local storage usage explained and justified
- ✅ Content script usage minimal and explained

Your extension fully complies with Chrome Web Store policies! 🚀
