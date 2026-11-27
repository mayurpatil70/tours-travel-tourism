# Devbhoomi Trails — Tours & Travel Website

A fast, secure static website for tours and travel (HTML, CSS and vanilla JS, no build step). It uses a **black and white theme with sky-blue accents and macOS/iOS-style liquid glass**, scroll-linked storytelling and animation effects based on Disney's principles of animation. Every Enquire button opens WhatsApp **+91 70177 25248** with the package details already filled in.

## Pages
| Page | What's on it |
|---|---|
| `index.html` | Sticky hero, half-round "About" section that rises over it as you scroll, stats, marquee, featured packages, departures, Char Dham spotlight, why us, **pinned gallery scrollytelling**, next-page teaser, reviews, FAQ, enquiry form |
| `packages.html` | All packages with category tabs, search and sort (accepts `?type=&dest=` from the home search) |
| `package.html?id=…` | Detail page: itinerary timeline, what's included and not, departure picker, traveller stepper with live total, WhatsApp enquiry with the chosen date and group size |
| `about.html` | Story, milestones, numbers, team |
| `contact.html` | Contact cards, enquiry form (`?pkg=` preselects a package), FAQ |

## Scrollytelling
- **Hero → About:** the hero stays pinned (`position: sticky`) while the light "About" section scrolls up over it. A half-round dome on top of that section rises in an arc and flattens out as it reaches the top. The hero title lines split apart left and right, and the hero image zooms and dims.
- **Gallery:** an 8-tile mosaic, including the bottom-right tile. Scrolling down pins the section: the first photo opens from its tile to full screen, then each next photo swipes in along an arc, one at a time. Scrolling up plays it in reverse. After the last photo the page continues to the **Next page** teaser.

## Performance (scroll lag fixes)
- Removed the SVG displacement filter that was recomputed on every frame under `backdrop-filter`.
- `backdrop-filter` is now used only on a few small or fixed elements (nav, chips, badges, search).
- Removed the animated 80px-blurred background blobs and blurred clouds.
- Removed the page-wide pointer-move handler and the `filter: blur` reveal and staging animations.
- One passive scroll listener feeds one `requestAnimationFrame`. Handlers write only `transform` and `opacity`, use values cached on resize, and skip unchanged writes.
- Uses `content-visibility: auto` on sections further down the page, lazy and async image decoding, a preloaded hero image, and system fonts (no web-font download).
- Tilt effect only on desktop, throttled to animation frames. The reviews carousel autoplays only while it is on screen.

## Security
- A strict **Content Security Policy** on every page and in `vercel.json`: scripts only from this site, images only from this site and Unsplash, `object-src 'none'`, `frame-ancestors 'none'`.
- Vercel headers: HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy and Permissions-Policy.
- No inline scripts or event handlers. All data is HTML-escaped before rendering. The `?id=` value from the URL is only used to look up a known package. Form input is length-limited, and the enquiry form stores nothing: it only builds a WhatsApp link.

## Edit content
- `assets/js/data.js` holds packages, categories, testimonials, FAQs, gallery frames and `WHATSAPP_NUMBER`.
- `assets/css/style.css` holds the theme tokens in `:root` and `.light`.
- `assets/js/app.js` holds the shared layout, the WhatsApp builder, the scroll engine and the code for each page.

## Run
```bash
python3 -m http.server 8080
```
Deploy on Vercel with Framework Preset **Other** and no build command.

## Animation effects
| Effect | Where |
|---|---|
| Squash and stretch | Hero words land with a squash; buttons squash on press and spring back; WhatsApp button hop; tab indicator |
| Anticipation | Button arrows wind back before shooting forward |
| Staging | Hovering a card fades the others; pinned hero and gallery |
| Pose to pose | Scroll reveals move through set key positions (`poseRise`, `poseLeft`, `posePop`) |
| Follow through | Spring overshoot on cards, nav pill, modal, tilt release |
| Slow in, slow out | Eased scroll scenes, count-up stats |
| Arcs | Gallery photos swipe in along an arc; confetti falls in parabolas; dome rises in an arc |
| Secondary action | Marquee, floating badges, icon wiggle, blinking seat indicator |
| Snappy timing | 160 ms tab, filter and card-exit transitions |
| Exaggerated feedback | Confetti and popping message on Enquire, heart pop, number pops, live total bump |
