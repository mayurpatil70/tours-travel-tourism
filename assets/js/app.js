/* =========================================================
   Devbhoomi Trails — shared core + page modules
   Perf: one passive scroll listener → one rAF → registered
   handlers. Handlers only write transform/opacity and read
   values cached on resize (no layout thrash).
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const byId = id => PACKAGES.find(p => p.id === id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
  const page = document.body.dataset.page || "home";

  /* ---------------- Scroll / resize manager ---------------- */
  const scrollFns = [], resizeFns = [];
  let sy = scrollY, ticking = false;
  const runScroll = () => { ticking = false; sy = scrollY; for (const f of scrollFns) f(sy); };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }, { passive: true });
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { resizeFns.forEach(f => f()); runScroll(); }, 120); });
  const onScroll = f => scrollFns.push(f);
  const onResize = f => resizeFns.push(f);

  /* Broken image → keep gradient fallback (CSP-safe, no inline onerror) */
  document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.style.visibility = "hidden"; }, true);

  /* ---------------- Layout: header / footer / overlays ---------------- */
  const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M3 33 L15 13 L21 22 L26 15 L37 33 Z" fill="currentColor"/><circle cx="29" cy="9" r="3.4" fill="#5ac8fa"/></svg>`;
  const NAV = [["home", "index.html", "Home"], ["packages", "packages.html", "Packages"], ["gallery", "index.html#gallery", "Gallery"], ["about", "about.html", "About"], ["contact", "contact.html", "Contact"]];
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip" href="#main">Skip to content</a>
    <header class="nav-wrap">
      <nav class="nav" id="nav" aria-label="Main">
        <a href="index.html" class="brand" aria-label="Devbhoomi Trails home"><span class="brand-mark squishy">${LOGO}</span><span class="brand-text">Devbhoomi<b>Trails</b></span></a>
        <ul class="nav-links" id="navLinks">
          ${NAV.map(([k, h, l]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}
          <li class="nav-pill" aria-hidden="true"></li>
        </ul>
        <a class="btn btn-primary btn-sm squishy wind-up" data-enquire="general" href="https://wa.me/${WHATSAPP_NUMBER}" rel="noopener"><span>Enquire</span><i class="arrow">→</i></a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
      </nav>
    </header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      <div class="foot-grid">
        <div><a href="index.html" class="brand"><span class="brand-mark">${LOGO}</span><span class="brand-text">Devbhoomi<b>Trails</b></span></a>
          <p>Himalayan treks, sacred yatras & handcrafted mountain holidays from Dehradun, Uttarakhand.</p></div>
        <div><h4>Treks</h4>${PACKAGES.filter(p => p.category === "trek").map(p => `<a href="package.html?id=${p.id}">${p.name}</a>`).join("")}</div>
        <div><h4>Explore</h4><a href="packages.html">All packages</a><a href="index.html#gallery">Gallery</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></div>
        <div><h4>Talk to us</h4><a href="https://wa.me/${WHATSAPP_NUMBER}" data-enquire="general" rel="noopener">WhatsApp +91 70177 25248</a><a href="tel:+917017725248">Call +91 70177 25248</a><span>Dehradun, Uttarakhand</span></div>
      </div>
      <p class="copy">© ${new Date().getFullYear()} Devbhoomi Trails · Made in the Himalayas</p>
    </footer>
    <a href="https://wa.me/${WHATSAPP_NUMBER}" class="fab squishy" data-enquire="general" aria-label="Chat on WhatsApp" rel="noopener">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.8 2 6.8L3.2 29l6.8-2.1c1.9 1.1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.4 9.9 10.2 5.2 16 5.2s10.6 4.7 10.6 10.5S21.8 26.1 16 26.1zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>
    </a>
    <div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="mTitle"><div class="modal-backdrop" data-close></div><div class="modal-card" id="modalCard"></div></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`);

  /* ---------------- WhatsApp enquiry ---------------- */
  function buildMessage(p, x = {}) {
    const mine = [];
    if (x.name) mine.push(`👤 Name: ${x.name}`);
    if (x.date) mine.push(`📅 Preferred date: ${x.date}`);
    if (x.pax) mine.push(`👥 Travellers: ${x.pax}`);
    if (x.pax && p) mine.push(`🧾 Estimated total: ${inr(p.price * x.pax)}`);
    if (x.note) mine.push(`📝 Note: ${x.note}`);
    if (!p) return ["Hello Devbhoomi Trails! 🙏",
      x.custom ? "I'd like to plan a custom / private tour." : "I'd like to plan a trip with you. Please share your best packages and upcoming departures.",
      ...(mine.length ? ["", "*My trip*", ...mine] : []), "", "Please suggest suitable options and a quote. Thank you!"].join("\n");
    return ["Hello Devbhoomi Trails! 🙏", `I'm interested in the *${p.name}* package.`, "", "*Package details*",
      `📍 Region: ${p.region}`, `🗓️ Duration: ${p.days} Days / ${p.nights} Nights`, `⛰️ Max altitude: ${p.altitude}`,
      `💪 Difficulty: ${p.difficulty}`, `🌤️ Best season: ${p.season}`, `💰 Listed price: ${inr(p.price)} per person`,
      ...(mine.length ? ["", "*My trip*", ...mine] : []), "", "Please share available dates, inclusions and the final quote. Thank you!"].join("\n");
  }
  const waLink = (p, x) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(p, x))}`;
  function openWhatsApp(p, x, el, evt) {
    const url = waLink(p, x);
    const w = window.open(url, "_blank", "noopener,noreferrer"); // inside the user gesture → not blocked
    if (!w) location.href = url;
    burst(evt, el);
    toast(p ? `💬 Opening WhatsApp · ${p.name}` : "💬 Opening WhatsApp…");
  }

  /* ---------------- Global click delegation ---------------- */
  document.addEventListener("click", e => {
    const en = e.target.closest("[data-enquire]");
    if (en) {
      e.preventDefault(); boing(en);
      const id = en.dataset.enquire;
      const x = en.dataset.date ? { date: en.dataset.date } : {};
      openWhatsApp(id === "general" ? null : byId(id), x, en, e);
      return;
    }
    const det = e.target.closest("[data-details]");
    if (det) { e.preventDefault(); boing(det); openModal(byId(det.dataset.details), e); return; }
    const fav = e.target.closest(".fav");
    if (fav) {
      const on = fav.getAttribute("aria-pressed") !== "true";
      fav.setAttribute("aria-pressed", on); fav.textContent = on ? "♥" : "♡";
      fav.classList.remove("on"); void fav.offsetWidth;
      if (on) { fav.classList.add("on"); burst(e, fav); toast("♥ Saved to wishlist"); }
      return;
    }
    const sq = e.target.closest(".squishy"); if (sq) boing(sq);
  });

  /* ---------------- Feedback helpers ---------------- */
  function boing(el) {
    if (reduced) return;
    el.classList.remove("boing"); void el.offsetWidth; el.classList.add("boing");
    el.addEventListener("animationend", () => el.classList.remove("boing"), { once: true });
  }
  const COLORS = ["#5ac8fa", "#ffffff", "#38bdf8", "#a5e3ff", "#8e8e93", "#25d366"];
  function burst(evt, el) {
    if (reduced) return;
    let x, y;
    if (evt && evt.clientX) { x = evt.clientX; y = evt.clientY; }
    else if (el) { const r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; } else return;
    const frag = document.createDocumentFragment(), parts = [];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span"), s = 6 + Math.random() * 7;
      p.className = "particle";
      p.style.cssText = `width:${s}px;height:${s}px;background:${COLORS[i % COLORS.length]};border-radius:${i % 2 ? "50%" : "2px"}`;
      frag.appendChild(p); parts.push(p);
    }
    document.body.appendChild(frag);
    parts.forEach((p, i) => {
      const a = (Math.PI * 2 * i) / parts.length + Math.random() * .4, v = 70 + Math.random() * 100;
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 60;
      p.animate([ // parabolic arc
        { transform: `translate(${x}px,${y}px)`, opacity: 1 },
        { transform: `translate(${x + dx * .6}px,${y + dy * .6 - 40}px) rotate(180deg) scale(1.2)`, opacity: 1, offset: .45 },
        { transform: `translate(${x + dx}px,${y + dy + 120}px) rotate(360deg) scale(.3)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => p.remove();
    });
  }
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg;
    t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2700);
  }

  /* ---------------- Cards ---------------- */
  function cardHTML(p, i) {
    return `<article class="card glass" style="--i:${i}">
      <a class="card-media" href="package.html?id=${p.id}" tabindex="-1" aria-hidden="true">
        <img src="${img(p.img.match(/photo-([^?]+)/)[1], 700)}" alt="" loading="lazy" decoding="async" width="700" height="480" />
        <span class="badge">${esc(p.badge)}</span>
        <span class="media-meta"><span class="rating">★ ${p.rating} · ${p.reviews.toLocaleString("en-IN")}</span><span>${esc(p.season)}</span></span>
      </a>
      <button class="fav" aria-label="Save ${esc(p.name)}" aria-pressed="false">♡</button>
      <div class="card-body">
        <span class="region">${esc(p.region)}</span>
        <h3><a href="package.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="meta"><div><small>Duration</small><b>${p.days}D / ${p.nights}N</b></div><div><small>Altitude</small><b>${esc(p.altitude)}</b></div><div><small>Grade</small><b>${esc(p.difficulty)}</b></div></div>
        <div class="dates">${p.dates.slice(0, 3).map(d => `<span>${esc(d)}</span>`).join("")}</div>
        <div class="card-foot">
          <div class="price"><small>Starting from</small><s>${inr(p.oldPrice)}</s><b>${inr(p.price)}</b> <em>/ person</em></div>
          <div class="card-actions">
            <button class="btn icon-btn squishy" data-details="${p.id}" aria-label="Quick view ${esc(p.name)}">ⓘ</button>
            <a href="${waLink(p)}" class="btn btn-primary squishy wind-up" data-enquire="${p.id}" rel="noopener"><span>Enquire</span><i class="arrow">→</i></a>
          </div>
        </div>
      </div>
    </article>`;
  }
  function renderCards(el, list) {
    const old = $$(".card", el);
    const draw = () => {
      el.innerHTML = list.map(cardHTML).join("");
      $$(".card", el).forEach(c => { c.classList.add("enter"); c.addEventListener("animationend", () => c.classList.remove("enter"), { once: true }); });
      bindTilt($$(".card", el));
    };
    if (old.length && !reduced) { old.forEach(c => c.classList.add("leave")); setTimeout(draw, 160); } else draw();
  }

  /* Tabs with stretchy indicator */
  function makeTabs(el, onChange, initial = "all") {
    el.innerHTML = CATEGORIES.map(c => `<button class="tab" role="tab" data-cat="${c.key}" aria-selected="${c.key === initial}">${c.label}</button>`).join("") + `<span class="tab-indicator" aria-hidden="true"></span>`;
    const ind = $(".tab-indicator", el);
    const move = (anim = true) => {
      const a = $('.tab[aria-selected="true"]', el); if (!a) return;
      ind.style.width = a.offsetWidth + "px";
      ind.style.transform = `translateX(${a.offsetLeft}px)`;
      if (anim && !reduced) ind.animate([{ transform: `translateX(${a.offsetLeft}px) scale(1.2,.85)` }, { transform: `translateX(${a.offsetLeft}px)` }], { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" });
    };
    const set = (cat, fire = true) => { $$(".tab", el).forEach(t => t.setAttribute("aria-selected", t.dataset.cat === cat)); move(); if (fire) onChange(cat); };
    el.addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) { boing(t); set(t.dataset.cat); } });
    onResize(() => move(false));
    requestAnimationFrame(() => move(false));
    return { set };
  }

  /* ---------------- Quick-view modal ---------------- */
  const modal = $("#modal"), mCard = $("#modalCard");
  let lastFocus;
  function openModal(p, evt) {
    if (!p) return;
    lastFocus = document.activeElement;
    if (evt && evt.clientX) { mCard.style.setProperty("--ox", evt.clientX / innerWidth * 100 + "%"); mCard.style.setProperty("--oy", evt.clientY / innerHeight * 100 + "%"); }
    mCard.innerHTML = `
      <div class="m-hero"><img src="${p.img.replace("w=900", "w=1200")}" alt="" decoding="async"/>
        <button class="m-close glass blur squishy" data-close aria-label="Close">✕</button>
        <div class="m-title"><span class="region" style="color:var(--sky)">${esc(p.region)}</span><h3 id="mTitle">${esc(p.name)}</h3></div></div>
      <div class="m-body">
        <div class="meta"><div><small>Duration</small><b>${p.days}D / ${p.nights}N</b></div><div><small>Altitude</small><b>${esc(p.altitude)}</b></div><div><small>Grade</small><b>${esc(p.difficulty)}</b></div><div><small>Season</small><b>${esc(p.season)}</b></div></div>
        <div><h4>Highlights</h4><div class="pills">${p.highlights.map(h => `<span>${esc(h)}</span>`).join("")}</div></div>
        <div class="two-col">
          <div><h4>Itinerary</h4><ol class="timeline">${p.itinerary.map((d, i) => `<li><span class="day">${i + 1}</span>${esc(d)}</li>`).join("")}</ol></div>
          <div><h4>Inclusions</h4><ul class="ticks" style="grid-template-columns:1fr">${p.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <a class="btn btn-sm squishy" href="package.html?id=${p.id}">Full details →</a></div>
        </div>
      </div>
      <div class="m-foot"><div class="price"><small>Starting from</small><s>${inr(p.oldPrice)}</s><b>${inr(p.price)}</b> <em>/ person</em></div>
        <a href="${waLink(p)}" class="btn btn-wa squishy wind-up" data-enquire="${p.id}" rel="noopener"><span>Enquire on WhatsApp</span><i class="arrow">→</i></a></div>`;
    modal.classList.remove("closing"); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => $(".m-close", mCard).focus({ preventScroll: true }), 40);
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.add("closing");
    setTimeout(() => { modal.classList.remove("open", "closing"); modal.setAttribute("aria-hidden", "true"); document.documentElement.style.overflow = ""; lastFocus && lastFocus.focus({ preventScroll: true }); }, reduced ? 0 : 200);
  }
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------------- Tilt (desktop only, rAF-throttled) ---------------- */
  function bindTilt(els) {
    if (reduced || !canHover) return;
    els.forEach(el => {
      let raf = 0, ev;
      el.addEventListener("pointermove", e => {
        ev = e; if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0; const r = el.getBoundingClientRect();
          const px = (ev.clientX - r.left) / r.width - .5, py = (ev.clientY - r.top) / r.height - .5;
          el.style.transform = `perspective(1000px) rotateX(${-py * 5}deg) rotateY(${px * 7}deg) translateY(-6px)`;
        });
      });
      el.addEventListener("pointerleave", () => { cancelAnimationFrame(raf); raf = 0; el.style.transform = ""; });
    });
  }

  /* ---------------- Reveal + counters ---------------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
    el.style.setProperty("--d", Math.max(0, sibs.indexOf(el)) * 80 + "ms");
    el.classList.add("in"); io.unobserve(el);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  const observeReveals = (root = document) => $$(".reveal:not(.in)", root).forEach(el => io.observe(el));

  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, dec = !!el.dataset.decimal, t0 = performance.now(), dur = reduced ? 1 : 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), v = end * easeIO(k);
      el.textContent = dec ? (v / 10).toFixed(1) : Math.round(v).toLocaleString("en-IN");
      if (k < 1) requestAnimationFrame(step); else el.classList.add("pop");
    };
    requestAnimationFrame(step); cio.unobserve(el);
  }), { threshold: .6 });

  /* ---------------- Nav behaviour ---------------- */
  const nav = $("#nav"), links = $$(".nav-links a"), pill = $(".nav-pill"), burger = $("#burger"), navList = $("#navLinks");
  let lastY = 0, hidden = false;
  onScroll(y => {
    const h = y > lastY && y > 400 && !navList.classList.contains("open");
    if (h !== hidden) { hidden = h; nav.classList.toggle("hide", h); }
    lastY = y;
  });
  const pillTo = a => { if (!a || !canHover) { pill.style.opacity = 0; return; } pill.style.opacity = 1; pill.style.width = a.offsetWidth + "px"; pill.style.transform = `translateX(${a.offsetLeft}px)`; };
  links.forEach(a => a.addEventListener("pointerenter", () => pillTo(a)));
  navList.addEventListener("pointerleave", () => pillTo($('.nav-links a[aria-current="page"]')));
  requestAnimationFrame(() => pillTo($('.nav-links a[aria-current="page"]')));
  burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); navList.classList.toggle("open", o); });
  links.forEach(a => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); navList.classList.remove("open"); }));

  /* ---------------- Shared widgets ---------------- */
  function initFAQ(el) {
    if (!el) return;
    el.innerHTML = FAQS.map((f, i) => `<div class="qa glass reveal"><button aria-expanded="false" aria-controls="ans${i}">${esc(f.q)}<span class="plus" aria-hidden="true">+</span></button><div class="ans" id="ans${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join("");
    el.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const qa = b.parentElement, open = !qa.classList.contains("open");
      $$(".qa", el).forEach(q => { q.classList.remove("open"); $("button", q).setAttribute("aria-expanded", "false"); });
      if (open) { qa.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  }

  function initEnquiryForm(form) {
    if (!form) return;
    const sel = form.querySelector("[name=pkg]");
    sel.innerHTML = `<option value="">Select a package (optional)</option>` + PACKAGES.map(p => `<option value="${p.id}">${esc(p.name)} — ${inr(p.price)}</option>`).join("") + `<option value="custom">Custom / private tour</option>`;
    const pre = new URLSearchParams(location.search).get("pkg");
    if (pre && byId(pre)) sel.value = pre;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nameEl = form.querySelector("[name=name]"), name = nameEl.value.trim().slice(0, 80);
      if (!name) { nameEl.classList.remove("shake"); void nameEl.offsetWidth; nameEl.classList.add("shake"); nameEl.focus(); return; }
      const x = { name, date: form.date.value, pax: clamp(parseInt(form.pax.value, 10) || 1, 1, 99), note: form.note.value.trim().slice(0, 300), custom: sel.value === "custom" };
      openWhatsApp(byId(sel.value) || null, x, e.submitter || form);
    });
    form.addEventListener("animationend", ev => ev.target.classList.remove("shake"));
  }

  function initCarousel() {
    const track = $("#carTrack"), dotsEl = $("#carDots"); if (!track) return;
    track.innerHTML = TESTIMONIALS.map(t => `<article class="review glass"><div class="stars">${"★".repeat(t.stars)}</div><p>“${esc(t.text)}”</p><div class="who"><span class="avatar">${t.name.split(" ").map(s => s[0]).slice(0, 2).join("")}</span><div><b>${esc(t.name)}</b><small>${esc(t.city)} · ${esc(t.trip)}</small></div></div></article>`).join("");
    dotsEl.innerHTML = TESTIMONIALS.map((_, i) => `<button aria-label="Review ${i + 1}"></button>`).join("");
    const rv = $$(".review", track), dots = $$("button", dotsEl);
    let idx = 0, raf = 0;
    const goTo = i => { idx = (i + rv.length) % rv.length; const r = rv[idx]; track.scrollTo({ left: r.offsetLeft - (track.clientWidth - r.clientWidth) / 2, behavior: reduced ? "auto" : "smooth" }); };
    const sync = () => {
      raf = 0; const mid = track.scrollLeft + track.clientWidth / 2; let best = 0, bd = Infinity;
      rv.forEach((r, i) => { const d = Math.abs(r.offsetLeft + r.clientWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      idx = best; rv.forEach((r, i) => r.classList.toggle("dim", i !== best)); dots.forEach((d, i) => d.classList.toggle("on", i === best));
    };
    track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
    $(".car-btn.prev").addEventListener("click", () => goTo(idx - 1));
    $(".car-btn.next").addEventListener("click", () => goTo(idx + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
    // autoplay only while visible
    let timer = null;
    new IntersectionObserver(([en]) => { clearInterval(timer); if (en.isIntersecting && !reduced) timer = setInterval(() => goTo(idx + 1), 5500); }).observe(track);
    track.addEventListener("pointerdown", () => clearInterval(timer));
    sync();
  }

  /* =========================================================
     HOME
     ========================================================= */
  function heroStory() {
    const hero = $(".hero"); if (!hero) return;
    const dome = $(".dome"), l1 = $(".hero-title .l1"), l2 = $(".hero-title .l2"), foot = $(".hero-foot"), media = $(".hero-media"), dim = $(".hero-dim"), hint = $(".scroll-hint");
    $$(".hero-title .w").forEach((w, i) => w.style.setProperty("--i", i));
    requestAnimationFrame(() => $(".hero-title").classList.add("go"));
    let vh = innerHeight, vw = innerWidth, done = false;
    onResize(() => { vh = innerHeight; vw = innerWidth; });
    onScroll(y => {
      const p = clamp(y / vh, 0, 1);
      if (p === 1 && done) return; done = p === 1;
      // Dome rises in an arc then flattens as the section reaches the top
      dome.style.transform = `scaleY(${Math.sin(Math.PI * p).toFixed(4)})`;
      const e = easeIO(p);
      l1.style.transform = `translate3d(${-e * vw * .28}px,${-e * 40}px,0)`;
      l2.style.transform = `translate3d(${e * vw * .28}px,${-e * 80}px,0)`;
      foot.style.transform = `translate3d(0,${-p * 70}px,0)`;
      foot.style.opacity = clamp(1 - p * 1.8, 0, 1);
      media.style.transform = `scale(${1 + p * .12})`;
      dim.style.opacity = p * .7;
      if (hint) hint.style.opacity = clamp(1 - p * 4, 0, 1);
    });
  }

  function gallery() {
    const sec = $("#gallery"); if (!sec) return;
    const N = GALLERY.length, HOLD_START = .25, HOLD_END = .5;
    const units = HOLD_START + N + HOLD_END;            // scroll "screens" while pinned
    $(".mosaic", sec).innerHTML = GALLERY.map((g, i) => `<figure class="tile"><img src="${img(g.img, i === 0 ? 900 : 500)}" alt="${esc(g.title)}" loading="lazy" decoding="async"/><figcaption>${esc(g.place)}</figcaption></figure>`).join("");
    $(".stage", sec).innerHTML = GALLERY.map((g, i) => `<div class="slide" style="z-index:${i + 1}"><img src="${img(g.img, 1600)}" alt="" loading="lazy" decoding="async"/><span class="shade"></span>
      <div class="slide-cap"><div><h3>${esc(g.title)}</h3><p>${esc(g.place)}</p></div><span class="num">${String(i + 1).padStart(2, "0")}</span></div></div>`).join("");
    const slides = $$(".slide", sec), shades = slides.map(s => $(".shade", s)), caps = slides.map(s => $(".slide-cap", s));
    const mosaic = $(".mosaic", sec), head = $(".ghead", sec), hud = $(".ghud", sec), bar = $(".gbar i", sec), count = $(".gcount", sec);
    const sticky = $(".gsticky", sec);
    let top = 0, vh = 0, r0 = { t: 0, r: 0, b: 0, l: 0 }, last = {};

    function measure() {
      vh = innerHeight;
      sec.style.height = (units * vh + vh) + "px";
      top = sec.getBoundingClientRect().top + scrollY;
      mosaic.style.transform = ""; // measure untransformed
      const s = sticky.getBoundingClientRect(), t = $(".tile", sec).getBoundingClientRect();
      r0 = { t: t.top - s.top, l: t.left - s.left, r: s.right - t.right, b: s.bottom - t.bottom };
      last = {};
    }
    const set = (el, k, prop, v) => { if (last[k] !== v) { last[k] = v; el.style[prop] = v; } };

    function frame(y) {
      const u = (y - top) / vh - HOLD_START;           // progress in "screens"
      if (u < -1.2 || u > units + .5) return;          // off-screen → skip work
      // phase 0: first tile grows to full screen (clip-path inset from its tile rect)
      const e0 = easeIO(clamp(u, 0, 1));
      const ins = `inset(${(r0.t * (1 - e0)).toFixed(1)}px ${(r0.r * (1 - e0)).toFixed(1)}px ${(r0.b * (1 - e0)).toFixed(1)}px ${(r0.l * (1 - e0)).toFixed(1)}px round ${(20 * (1 - e0)).toFixed(1)}px)`;
      set(slides[0], "v0", "visibility", u > 0 ? "visible" : "hidden");
      set(slides[0], "c0", "clipPath", ins);
      set(mosaic, "m", "transform", `scale(${(1 - e0 * .06).toFixed(4)})`);
      set(mosaic, "mo", "opacity", (1 - e0 * .9).toFixed(3));
      set(head, "h", "opacity", (1 - e0).toFixed(3));
      set(caps[0], "cap0", "opacity", clamp((u - .7) / .3, 0, 1).toFixed(3));
      // phases 1..N-1: each next photo swipes in along a slight arc, pushing the previous back
      for (let k = 0; k < N; k++) {
        const tIn = k === 0 ? 1 : easeIO(clamp(u - k, 0, 1));
        const tOut = k + 1 < N ? easeIO(clamp(u - (k + 1), 0, 1)) : 0;
        if (k > 0) set(slides[k], "v" + k, "visibility", tIn > 0 ? "visible" : "hidden");
        if (k > 0 && tIn === 0) continue;
        const x = (1 - tIn) * 100 - tOut * 22;
        const arcY = -Math.sin(Math.PI * tIn) * 6 * (k ? 1 : 0);   // moving in arcs
        const rot = (1 - tIn) * 7;
        const sc = 1 - tOut * .1;
        set(slides[k], "t" + k, "transform", `translate3d(${x.toFixed(2)}%,${arcY.toFixed(2)}vh,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`);
        set(shades[k], "s" + k, "opacity", (tOut * .6).toFixed(3));
        if (k > 0) set(caps[k], "cap" + k, "opacity", clamp((u - k - .55) / .35, 0, 1).toFixed(3));
      }
      const cur = clamp(Math.floor(u + .5), 1, N);
      const on = u > .6 && u < N + HOLD_END - .1;
      if (last.hud !== on) { last.hud = on; hud.classList.toggle("on", on); }
      if (last.cur !== cur) { last.cur = cur; count.textContent = `${String(cur).padStart(2, "0")} / ${String(N).padStart(2, "0")}`; }
      set(bar, "bar", "transform", `scaleX(${clamp(u / N, 0, 1).toFixed(4)})`);
    }
    measure();
    onResize(measure);
    // images in the mosaic can shift layout once loaded → re-measure once
    addEventListener("load", () => { measure(); frame(scrollY); }, { once: true });
    onScroll(frame);
  }

  function departures() {
    const el = $("#departureList"); if (!el) return;
    const M = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }, now = new Date(), deps = [];
    PACKAGES.forEach(p => p.dates.forEach(d => {
      const m = d.match(/^(\d{2}) (\w{3})$/); if (!m) return;
      const dt = new Date(now.getFullYear(), M[m[2]], +m[1]); if (dt < now) dt.setFullYear(dt.getFullYear() + 1);
      deps.push({ p, d, dt });
    }));
    deps.sort((a, b) => a.dt - b.dt);
    el.innerHTML = deps.slice(0, 6).map((x, i) => {
      const seats = (x.p.reviews + i * 7) % 14 + 2;
      return `<div class="dep"><div class="dep-date">${x.d}<small>${x.dt.getFullYear()} · ${x.p.days} days</small></div>
        <div class="dep-name"><b><a href="package.html?id=${x.p.id}">${esc(x.p.name)}</a></b><small>${esc(x.p.region)} · from ${inr(x.p.price)}</small></div>
        <span class="seats ${seats < 6 ? "low" : "ok"}">${seats < 6 ? `Only ${seats} seats left` : `${seats} seats open`}</span>
        <a href="#" class="btn btn-ink btn-sm squishy wind-up" data-enquire="${x.p.id}" data-date="${x.d} ${x.dt.getFullYear()}"><span>Enquire</span><i class="arrow">→</i></a></div>`;
    }).join("");
  }

  function home() {
    heroStory();
    // featured packages (6) with tabs
    const cards = $("#cards");
    const show = cat => renderCards(cards, PACKAGES.filter(p => cat === "all" || p.category === cat).slice(0, 6));
    const tabs = makeTabs($("#tabs"), show);
    show("all");
    $("#searchForm").addEventListener("submit", e => {
      e.preventDefault();
      const q = new URLSearchParams({ type: $("#sType").value, dest: $("#sDest").value, month: $("#sMonth").value });
      location.href = "packages.html?" + q.toString();
    });
    departures();
    gallery();
    initCarousel();
    initFAQ($("#faqList"));
    initEnquiryForm($("#enquiryForm"));
    void tabs;
  }

  /* =========================================================
     PACKAGES (listing)
     ========================================================= */
  function packagesPage() {
    const qs = new URLSearchParams(location.search);
    let cat = CATEGORIES.some(c => c.key === qs.get("type")) ? qs.get("type") : "all";
    const search = $("#q"), sort = $("#sort"), grid = $("#cards"), empty = $("#emptyState"), count = $("#resultCount");
    const dest = qs.get("dest") || "";
    if (dest) search.value = dest;
    const apply = () => {
      const q = search.value.trim().toLowerCase();
      let list = PACKAGES.filter(p => (cat === "all" || p.category === cat) &&
        (!q || `${p.name} ${p.region} ${p.category} ${p.highlights.join(" ")}`.toLowerCase().includes(q) || (q === "char dham" && p.category === "pilgrimage")));
      const s = sort.value;
      if (s === "price-asc") list.sort((a, b) => a.price - b.price);
      if (s === "price-desc") list.sort((a, b) => b.price - a.price);
      if (s === "days") list.sort((a, b) => a.days - b.days);
      if (s === "rating") list.sort((a, b) => b.rating - a.rating);
      renderCards(grid, list);
      empty.hidden = list.length > 0;
      count.textContent = `${list.length} journey${list.length === 1 ? "" : "s"}`;
    };
    makeTabs($("#tabs"), c => { cat = c; apply(); }, cat);
    let t; search.addEventListener("input", () => { clearTimeout(t); t = setTimeout(apply, 140); });
    sort.addEventListener("change", apply);
    apply();
    initEnquiryForm($("#enquiryForm"));
  }

  /* =========================================================
     PACKAGE (detail)
     ========================================================= */
  function packagePage() {
    const id = new URLSearchParams(location.search).get("id");
    const p = byId(id);
    const root = $("#pd");
    if (!p) {
      root.innerHTML = `<section class="page-hero"><div class="bg"></div><div class="wrap"><p class="crumbs"><a href="index.html">Home</a> / <a href="packages.html">Packages</a></p><h1>Trip not found</h1><p>This package may have moved. Browse all journeys instead.</p><p><a class="btn btn-primary squishy" href="packages.html">All packages →</a></p></div></section>`;
      return;
    }
    document.title = `${p.name} — ${p.days} Days | Devbhoomi Trails`;
    const big = p.img.replace("w=900", "w=1800");
    root.innerHTML = `
      <section class="page-hero has-dome">
        <div class="bg"><img src="${big}" alt="" decoding="async" fetchpriority="high"/></div>
        <div class="wrap">
          <p class="crumbs"><a href="index.html">Home</a> / <a href="packages.html">Packages</a> / ${esc(p.name)}</p>
          <span class="badge" style="position:static;display:inline-block;margin-bottom:16px">${esc(p.badge)} · ★ ${p.rating} (${p.reviews.toLocaleString("en-IN")})</span>
          <h1>${esc(p.name)}</h1>
          <div class="pd-meta">
            <div class="dark-glass blur"><small>Duration</small><b>${p.days}D / ${p.nights}N</b></div>
            <div class="dark-glass blur"><small>Max altitude</small><b>${esc(p.altitude)}</b></div>
            <div class="dark-glass blur"><small>Grade</small><b>${esc(p.difficulty)}</b></div>
            <div class="dark-glass blur"><small>Best season</small><b>${esc(p.season)}</b></div>
          </div>
        </div>
        <div class="dome-static"></div>
      </section>
      <section class="section light" style="padding-top:60px">
        <div class="wrap pd-grid">
          <div>
            <div class="pd-block reveal"><span class="eyebrow">Overview</span><h2>Why you'll love it</h2><div class="pills">${p.highlights.map(h => `<span>✦ ${esc(h)}</span>`).join("")}</div></div>
            <div class="pd-block"><span class="eyebrow reveal">Day by day</span><h2 class="reveal">Itinerary</h2>
              <ol class="timeline">${p.itinerary.map((d, i) => `<li class="reveal" data-pose="left"><span class="day">${String(i + 1).padStart(2, "0")}</span><b>Day ${i + 1}</b><small>${esc(d)}</small></li>`).join("")}</ol></div>
            <div class="pd-block two-col">
              <div class="reveal"><h2>Included</h2><ul class="ticks" style="grid-template-columns:1fr">${p.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
              <div class="reveal"><h2>Not included</h2><ul class="ticks cross" style="grid-template-columns:1fr">${EXCLUSIONS.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
            </div>
          </div>
          <aside class="book glass reveal" data-pose="pop" aria-label="Enquire">
            <div class="price"><small>Starting from</small><s>${inr(p.oldPrice)}</s><b>${inr(p.price)}</b> <em>/ person</em></div>
            <hr/>
            <label>Choose a departure</label>
            <div class="date-choices">${p.dates.map((d, i) => `<button type="button" aria-pressed="${i === 0}" data-d="${esc(d)}">${esc(d)}</button>`).join("")}</div>
            <label for="paxOut">Travellers</label>
            <div class="stepper"><button type="button" data-step="-1" aria-label="Fewer travellers">−</button><output id="paxOut">2</output><button type="button" data-step="1" aria-label="More travellers">+</button></div>
            <div class="total"><span>Estimated total</span><b id="total">${inr(p.price * 2)}</b></div>
            <a href="${waLink(p)}" class="btn btn-wa squishy wind-up" id="bookBtn" rel="noopener"><span>Enquire on WhatsApp</span><i class="arrow">→</i></a>
            <p class="note">Your package details are filled into the message for you.</p>
          </aside>
        </div>
      </section>
      <section class="section dark">
        <div class="wrap"><div class="section-head"><span class="eyebrow lines reveal">You may also like</span><h2 class="h2 reveal">More journeys</h2></div><div class="cards" id="related"></div></div>
      </section>`;
    let pax = 2, date = p.dates[0];
    const out = $("#paxOut"), total = $("#total");
    $(".stepper").addEventListener("click", e => {
      const b = e.target.closest("[data-step]"); if (!b) return;
      boing(b); pax = clamp(pax + +b.dataset.step, 1, 30); out.textContent = pax;
      total.textContent = inr(p.price * pax); total.classList.remove("bump"); void total.offsetWidth; total.classList.add("bump");
    });
    $(".date-choices").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      $$(".date-choices button").forEach(x => x.setAttribute("aria-pressed", x === b)); boing(b); date = b.dataset.d;
    });
    $("#bookBtn").addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); boing(e.currentTarget); openWhatsApp(p, { date, pax }, e.currentTarget, e); });
    const rel = PACKAGES.filter(x => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
    renderCards($("#related"), rel);
    $(".next-page .big span").textContent = "Plan with us";
  }

  /* =========================================================
     ABOUT / CONTACT
     ========================================================= */
  function aboutPage() { /* static content; reveals + counters handled globally */ }
  function contactPage() { initEnquiryForm($("#enquiryForm")); initFAQ($("#faqList")); }

  /* ---------------- Boot ---------------- */
  ({ home, packages: packagesPage, package: packagePage, about: aboutPage, contact: contactPage }[page] || (() => { }))();
  bindTilt($$(".tilt"));
  observeReveals();
  $$("[data-count]").forEach(el => cio.observe(el));
  // images that failed before this script ran
  $$("img").forEach(i => { if (i.complete && i.naturalWidth === 0 && i.currentSrc) i.style.visibility = "hidden"; });
  // re-observe reveals inside dynamically rendered card grids
  new MutationObserver(() => observeReveals()).observe($("main"), { childList: true, subtree: true });
  runScroll();
})();
