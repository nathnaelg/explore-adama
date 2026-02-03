# Google Maps API Setup Guide

This document provides instructions for setting up Google Maps API integration across the Explore Adama platform (backend, admin panel, and mobile app).

## Overview

The Explore Adama platform uses Google Maps API for:
- **Admin Panel**: Interactive map for adding and managing places with location selection
- **Mobile App**: Displaying places on a map with markers and navigation
- **Backend**: Storing and validating geographic coordinates

## Prerequisites

You need a Google Cloud Platform account with billing enabled to use Google Maps APIs.

## Step 1: Create a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **API Key**
5. Copy the generated API key

## Step 2: Enable Required APIs

Enable the following APIs for your project:

### For Admin Panel (Web)
- **Maps JavaScript API** - Required for displaying interactive maps in the admin panel

### For Mobile App (Android)
- **Maps SDK for Android** - Required for React Native Maps on Android devices

### Optional but Recommended
- **Geocoding API** - For converting addresses to coordinates and vice versa
- **Places API** - For place search and autocomplete features (future enhancement)

To enable APIs:
1. Go to **APIs & Services** > **Library**
2. Search for each API listed above
3. Click on the API and press **Enable**

## Step 3: Restrict Your API Key (Recommended)

For security, restrict your API key usage:

### Application Restrictions
Create separate API keys for web and mobile, or use a single key with both restrictions:

**For Web (Admin Panel):**
- Restriction Type: HTTP referrers (websites)
- Website restrictions: Add your admin panel domains
  - `http://localhost:*` (for development)
  - `https://youradmindomain.com/*` (for production)

**For Mobile (Android):**
- Restriction Type: Android apps
- Add your app's package name: `com.exploreadama`
- Add your app's SHA-1 certificate fingerprint

### API Restrictions
Restrict the key to only the APIs you need:
- Maps JavaScript API
- Maps SDK for Android
- Geocoding API (if using)

## Step 4: Configure Environment Variables

### Backend

Create or update `/home/natye/explore-adama/backend/.env`:

```bash
# Google Maps Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Admin Panel

Create or update `/home/natye/explore-adama/admin/.env.local`:

```bash
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Mobile App

Update `/home/natye/explore-adama/mobile/app.json` to include the API key in the `extra` section:

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "your_google_maps_api_key_here"
    }
  }
}
```

Alternatively, create a `.env` file in `/home/natye/explore-adama/mobile/`:

```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Step 5: Configure Android App

For the mobile app to work on Android, you need to add the API key to the Android manifest:

1. The API key will be automatically configured through `app.json`
2. Ensure your `google-services.json` is properly configured (already done)
3. For production builds, add your release SHA-1 fingerprint to Google Cloud Console

To get your SHA-1 fingerprint:
```bash
cd /home/natye/explore-adama/mobile
# For debug builds
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release builds (when you create a release keystore)
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

## Step 6: Verify Setup

### Backend
```bash
cd /home/natye/explore-adama/backend
npm run dev
# Check console for any errors related to GOOGLE_MAPS_API_KEY
```

### Admin Panel
```bash
cd /home/natye/explore-adama/admin
npm run dev
# Open http://localhost:5173 and navigate to Places Map
# Verify the map loads correctly
```

### Mobile App
```bash
cd /home/natye/explore-adama/mobile
npx expo start
# Open the app and navigate to the Map tab
# Verify places appear as markers
```

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `.env`, `.env.local` to `.gitignore`
   - Use environment variables for all sensitive data

2. **Use API key restrictions**
   - Restrict by HTTP referrer for web
   - Restrict by Android package name and SHA-1 for mobile

3. **Monitor API usage**
   - Set up billing alerts in Google Cloud Console
   - Monitor usage in the APIs & Services dashboard

4. **Rotate keys periodically**
   - Generate new API keys every 6-12 months
   - Update all environments when rotating

## Troubleshooting

### Map not loading in admin panel
- Check browser console for errors
- Verify `VITE_GOOGLE_MAPS_API_KEY` is set correctly
- Ensure Maps JavaScript API is enabled
- Check API key restrictions allow your domain

### Map not loading in mobile app
- Verify `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is in `app.json` or `.env`
- Ensure Maps SDK for Android is enabled
- Check that your app's package name and SHA-1 are added to API restrictions
- Rebuild the app after changing environment variables

### "This page can't load Google Maps correctly" error
- API key is invalid or not set
- Required APIs are not enabled
- Billing is not enabled on your Google Cloud project
- API key restrictions are blocking the request

## Cost Considerations

Google Maps offers a free tier with $200 monthly credit, which covers:
- ~28,000 map loads per month (Maps JavaScript API)
- ~28,000 map loads per month (Maps SDK for Android)

For the Explore Adama platform's expected usage, this should be sufficient. Monitor usage in Google Cloud Console to avoid unexpected charges.

## Support

For issues with Google Maps API:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps Platform Support](https://developers.google.com/maps/support)

For issues with this implementation:
- Check the implementation plan in the project documentation
- Review the map configuration files in each platform
