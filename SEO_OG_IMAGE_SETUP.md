# SEO Configuration Notes

## Open Graph Image (og-preview.jpg)

**Status**: PENDING - Image needs to be created/uploaded

The `index.html` references an Open Graph preview image at:
- URL: `https://atharvbhosale.site/og-preview.jpg`
- Path: `/client/public/og-preview.jpg`

### Required Image Specifications:
- **Dimensions**: 1200 × 630 pixels
- **Format**: JPG (or convert to JPG during build)
- **File Size**: < 100KB recommended for fast loading
- **Content Suggestions**:
  - Professional headshot of Atharv Bhosale
  - Screenshot of a featured project with logo overlay
  - Portfolio branding with name and title

### Current Usage:
This image is referenced in:
1. Open Graph meta tags (Facebook, LinkedIn, etc.)
2. Twitter Card meta tags (Twitter, messaging apps)
3. Person schema markup (JSON-LD)

### Action Required:
1. Create or prepare a 1200×630px image
2. Export as JPG and name it `og-preview.jpg`
3. Place in `/client/public/og-preview.jpg`
4. The image will be accessible at: `https://atharvbhosale.site/og-preview.jpg`

### Testing:
After uploading the image, test social media previews:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
