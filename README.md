# Devbhoomi Trails — Tours & Travel Website

A static tours and travel website (HTML/CSS/JS, no build step) with a liquid-glass UI and animations based on Disney's principles of animation. Enquiries go straight to WhatsApp **+91 70177 25248**, with the package details already filled in.

## Run
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

## Edit content
- `assets/js/data.js` holds packages (price, dates, itinerary, inclusions), categories, testimonials, FAQs and `WHATSAPP_NUMBER`.
- `assets/css/style.css` holds the theme tokens (`:root`), liquid-glass styles and motion keyframes.
- `assets/js/app.js` holds rendering, the WhatsApp message builder and the interactions.

## Animation principles → where they appear
| Principle | Where |
|---|---|
| Squash & stretch | Hero words land with squash; every button squashes on press and stretches on release (`.boing`); FAB hop |
| Anticipation | Button arrows wind back before shooting forward (`windup`) |
| Staging | Hovering a card dims and blurs the others; Char Dham spotlight section |
| Pose to pose | Scroll reveals use key poses (`poseRise`, `poseDrop`, `poseLeft`) |
| Follow through | Spring overshoot on cards, tabs, nav pill, modal and tilt release |
| Slow in / slow out | `--ease-io` curves, count-up stats, plane flight |
| Arcs | Plane flies along a curved path; particle bursts fall in parabolas |
| Secondary action | Drifting clouds, ambient blobs, floating badges, icon wiggle, glass highlight that follows the pointer |
| Snappy timing | 160 ms tab, filter and card-exit transitions |
| Exaggeration | Confetti burst and popping toast on Enquire, heart pop on wishlist, number pop on stats |

`prefers-reduced-motion` is respected.
