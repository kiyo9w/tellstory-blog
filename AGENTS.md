# Tellstory Blog (`tellstory-blog.web.app`)

Canonical root: `/Users/ngotrung/Documents/Projects/tellstory-blog`
Canonical branch: `main`

## Architecture

- Static HTML/CSS/ES-module application hosted on Firebase Hosting (`tellstory-blog`), with client-side Cloud Firestore and Firebase Auth (`firebase-config.js`).
- No bundler or compile step: `.html`, `.css`, and `.js` files in the repository root and `assets/` are served directly.
- Commit `6ed5ae8` preserves the verbatim 69-file production snapshot from `https://tellstory-blog.web.app/`.
