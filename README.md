# Axo public website
Standalone static marketing/legal website. This folder is outside `axo_app` and can be its own public GitHub repository. No Flutter source, keystore, credentials, or app user data are included.

## Pages
- `index.html` — marketing landing page with illustrative interactive previews
- `privacy/index.html` — full privacy policy, readable without JavaScript
- `terms/index.html` — terms and conditions
- `support/index.html` — support and privacy contact

Everything is self-hosted: HTML, CSS, JavaScript, optimised artwork and Nunito font. No build, paid hosting, runtime dependencies, trackers, cookies, forms, or analytics. The demo is in-memory only. Site links are relative so GitHub project paths work.

## Preview
From this folder, run:
```sh
python3 -m http.server 8080 --bind 127.0.0.1
```
Open `http://127.0.0.1:8080/`. Stop with Ctrl+C. No Flutter build is needed.

## Publish for free on GitHub Pages
1. Create a **public** repository, for example `axo-site`, under your GitHub account. Upload **only the contents of this folder**, not the parent workspace or the Flutter app.
2. Put `index.html`, `.nojekyll`, `assets/`, `privacy/`, `terms/`, and `support/` at the repository root on the `main` branch.
3. In the repository's **Settings → Pages**, select **Deploy from a branch**, then **main**, **/ (root)** and Save.
4. Wait for GitHub Pages to publish and use the actual URL GitHub displays. Keep HTTPS enabled.
5. Visit all pages while signed out before adding their URLs to Play Console.

With a repository named `axo-site`, the URL pattern is:
- Website: `https://YOUR_GITHUB_USERNAME.github.io/axo-site/`
- Privacy policy: `https://YOUR_GITHUB_USERNAME.github.io/axo-site/privacy/`
- Terms: `https://YOUR_GITHUB_USERNAME.github.io/axo-site/terms/`
- Support: `https://YOUR_GITHUB_USERNAME.github.io/axo-site/support/`

## Hosting configuration

Repository: [malikhamza88/axo-site](https://github.com/malikhamza88/axo-site).
GitHub Pages source: `main` branch, repository root. Publication was requested
on 11 October 2026. These are the configured addresses; deployment status must
still be checked after each push.

- Website: https://malikhamza88.github.io/axo-site/
- Privacy: https://malikhamza88.github.io/axo-site/privacy/
- Terms: https://malikhamza88.github.io/axo-site/terms/
- Support: https://malikhamza88.github.io/axo-site/support/

Canonical URLs and `sitemap.xml` now use this hosting address. Only this separate
website repository is public; the Flutter app and private signing material are
not included.

## Before public launch
- Confirm the developer identity / store developer name, support mailbox access, intended audience and the under-13 exclusion. The policy names the exact app and verified contact; do not invent a company identity.
- These documents are a practical draft based on inspected source, not a guarantee of legal or Google Play compliance. Have the owner and, where appropriate, a qualified legal adviser review them.
- Add the final policy/terms URLs inside the app and complete Play's Data safety and sensitive-permission declarations consistently. Creating web pages does not perform those steps.
- Update the policy and terms when RevenueCat, real purchases, remote analytics, cloud sync, ads, or other data flows are integrated. Billing Library 8.3.0 is bundled but the present paywall is preview-only.
- Check OS backup behaviour and the store target-audience declarations for the shipping build.
- Public store/testing URLs weren't supplied: the CTA honestly opens an Android testing enquiry by email. Replace it with the verified Google Play URL when access is ready. Don't imply open downloads during a closed test.
- Canonical URLs and a sitemap use the configured GitHub Pages address. A dedicated social-sharing image can be added later.
- Review website/app text together after every privacy-affecting release.

## Checks
```sh
python3 scripts/check_site.py
node --check assets/site.js
```
The local checker checks page titles, main/heading/viewport basics, duplicate IDs and relative file/fragment targets, including CSS assets. Browser viewport/interaction QA is a separate check.

### Verification performed
Browser checks passed at 320, 375, 767, 768, 1024 and 1440 pixels: all four pages, no
horizontal overflow, visible images, greetings, lighting, feature selectors,
checkbox feedback and focus-duration choices. Legal content and email links also
worked with JavaScript disabled; reduced motion disables the greeting animation.
Desktop and mobile screenshots were inspected and scene-control spacing refined.

Optional browser QA: install Playwright in your own development environment,
run the local server, then `node scripts/browser_qa.cjs`. Set `AXO_BROWSER_PATH`
for a non-macOS Chrome executable and `AXO_PREVIEW_URL` for a different local URL.
QA screenshots go to `/private/tmp` on the current macOS host. This script is not
needed for hosting; the public site remains dependency-free.

## Sources and policies
- [Google Play user-data and privacy-policy requirements](https://support.google.com/googleplay/android-developer/answer/10144311)
- [GitHub Pages and free public-repository hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub hosting privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [Google privacy policy](https://policies.google.com/privacy)

## Asset provenance
Approved Axo mascot and habitat art copied/optimised from the adjacent app's assets; originals were not changed. Nunito is copied with its original SIL Open Font License at `assets/OFL.txt`. Read `DESIGN.md` for the visual plan.
