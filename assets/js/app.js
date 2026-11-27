/* =========================================================
   Devbhoomi Trails — interactions & motion
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const byId = id => PACKAGES.find(p => p.id === id);

  /* ---------------- WhatsApp enquiry ---------------- */
  function buildMessage(pkg, extra = {}) {
    const mine = [];
    if (extra.name) mine.push(`👤 Name: ${extra.name}`);
    if (extra.date) mine.push(`📅 Preferred date: ${extra.date}`);
    if (extra.pax) mine.push(`👥 Travellers: ${extra.pax}`);
    if (extra.note) mine.push(`📝 Note: ${extra.note}`);
    if (!pkg) {
      return ["Hello Devbhoomi Trails! 🙏",
        extra.custom ? "I'd like to plan a custom / private tour." : "I'd like to plan a trip with you. Please share your best packages and upcoming departures.",
        ...(mine.length ? ["", "*My trip*", ...mine] : []),
        "", "Please suggest suitable options and a quote. Thank you!"].join("\n");
    }
    const lines = [
      "Hello Devbhoomi Trails! 🙏",
      `I'm interested in the *${pkg.name}* package.`,
      "",
      "*Package details*",
      `📍 Region: ${pkg.region}`,
      `🗓️ Duration: ${pkg.days} Days / ${pkg.nights} Nights`,
      `⛰️ Max altitude: ${pkg.altitude}`,
      `💪 Difficulty: ${pkg.difficulty}`,
      `🌤️ Best season: ${pkg.season}`,
      `💰 Listed price: ${inr(pkg.price)} per person`
    ];
    if (mine.length) lines.push("", "*My trip*", ...mine);
    lines.push("", "Please share available dates, inclusions and the final quote. Thank you!");
    return lines.join("\n");
  }
  const waLink = (pkg, extra) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(pkg, extra))}`;

  function openWhatsApp(pkg, extra, originEl, evt) {
    const url = waLink(pkg, extra);
    // open synchronously inside the user gesture so pop-up blockers allow it
    const w = window.open(url, "_blank", "noopener");
    if (!w) location.href = url;
    burst(evt, originEl);
    toast(pkg ? `💬 Opening WhatsApp for ${pkg.name}…` : "💬 Opening WhatsApp…");
  }

  document.addEventListener("click", e => {
    const en = e.target.closest("[data-enquire]");
    if (en) {
      e.preventDefault();
      boing(en);
      const id = en.dataset.enquire;
      openWhatsApp(id === "general" ? null : byId(id), {}, en, e);
      return;
    }
    const det = e.target.closest("[data-details]");
    if (det) { e.preventDefault(); boing(det); openModal(byId(det.dataset.details), e); return; }
    const sq = e.target.closest(".squishy");
    if (sq) boing(sq);
  });

  /* ---------------- Squash & stretch helper ---------------- */
  function boing(el) {
    if (reduced) return;
    el.classList.remove("boing"); void el.offsetWidth; el.classList.add("boing");
    el.addEventListener("animationend", () => el.classList.remove("boing"), { once: true });
  }

  /* ---------------- Exaggerated feedback: particle burst along arcs ---------------- */
  const COLORS = ["#ffb547", "#ff7a59", "#25d366", "#6fc3ff", "#ffffff", "#ffe2a6"];
  function burst(evt, el) {
    if (reduced) return;
    let x, y;
    if (evt && evt.clientX) { x = evt.clientX; y = evt.clientY; }
    else { const r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 6 + Math.random() * 8;
      p.style.cssText = `width:${size}px;height:${size}px;background:${COLORS[i % COLORS.length]};border-radius:${Math.random() > .5 ? "50%" : "3px"}`;
      document.body.appendChild(p);
      const ang = (Math.PI * 2 * i) / 22 + Math.random() * .4;
      const v = 80 + Math.random() * 110;
      const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v - 60;
      // parabolic arc: rise then fall with gravity
      p.animate([
        { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
        { transform: `translate(${x + dx * .6}px, ${y + dy * .6 - 40}px) scale(1.2) rotate(180deg)`, opacity: 1, offset: .45 },
        { transform: `translate(${x + dx}px, ${y + dy + 120}px) scale(.3) rotate(360deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => p.remove();
    }
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2700);
  }

  /* ---------------- Tabs + cards ---------------- */
  const tabsEl = $("#tabs"), cardsEl = $("#cards");
  let current = "all", destFilter = "";
  tabsEl.innerHTML = CATEGORIES.map(c =>
    `<button class="tab" role="tab" data-cat="${c.key}" aria-selected="${c.key === "all"}"><span aria-hidden="true">${c.icon}</span> ${c.label}</button>`
  ).join("") + `<span class="tab-indicator" aria-hidden="true"></span>`;
  const indicator = $(".tab-indicator", tabsEl);

  function moveIndicator(animate = true) {
    const active = $(`.tab[aria-selected="true"]`, tabsEl);
    if (!active) return;
    const tx = `translateX(${active.offsetLeft}px)`;
    indicator.style.setProperty("--tx", tx);
    indicator.style.width = active.offsetWidth + "px";
    indicator.style.transform = tx;
    if (animate && !reduced) { indicator.classList.remove("stretch"); void indicator.offsetWidth; indicator.classList.add("stretch"); }
  }

  function cardHTML(p, i) {
    return `
    <article class="card glass" style="--i:${i};--h:${p.hue}" data-id="${p.id}">
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()" />
        <span class="badge">${p.badge}</span>
        <button class="fav" aria-label="Save ${p.name}" aria-pressed="false">♡</button>
        <div class="media-meta"><span class="rating">★ ${p.rating} · ${p.reviews.toLocaleString("en-IN")} reviews</span><span>${p.season}</span></div>
      </div>
      <div class="card-body">
        <span class="region">${p.region}</span>
        <h3>${p.name}</h3>
        <div class="meta">
          <div><small>Duration</small><b>${p.days}D / ${p.nights}N</b></div>
          <div><small>Altitude</small><b>${p.altitude}</b></div>
          <div><small>Grade</small><b>${p.difficulty}</b></div>
        </div>
        <div class="dates">${p.dates.slice(0, 3).map(d => `<span>${d}</span>`).join("")}</div>
        <div class="card-foot">
          <div class="price"><small>Starting from</small><s>${inr(p.oldPrice)}</s><b>${inr(p.price)}</b> <em>/ person</em></div>
          <div class="card-actions">
            <button class="btn btn-ghost icon-btn squishy" data-details="${p.id}" aria-label="View ${p.name} details">ⓘ</button>
            <a href="${waLink(p)}" class="btn btn-primary squishy wind-up" data-enquire="${p.id}" target="_blank" rel="noopener"><span>Enquire</span><i class="arrow">→</i></a>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderCards() {
    const list = PACKAGES.filter(p =>
      (current === "all" || p.category === current) &&
      (!destFilter || (p.region + " " + p.name).toLowerCase().includes(destFilter.toLowerCase()) ||
        (destFilter === "Char Dham" && p.category === "pilgrimage"))
    );
    const old = $$(".card", cardsEl);
    const draw = () => {
      cardsEl.innerHTML = list.map(cardHTML).join("");
      $("#emptyState").hidden = list.length > 0;
      $$(".card", cardsEl).forEach(c => { c.classList.add("enter"); c.addEventListener("animationend", () => c.classList.remove("enter"), { once: true }); });
      bindTilt($$(".card", cardsEl));
    };
    if (old.length && !reduced) { old.forEach(c => c.classList.add("leave")); setTimeout(draw, 170); } // snappy out, springy in
    else draw();
  }

  function setCategory(cat) {
    current = cat;
    $$(".tab", tabsEl).forEach(t => t.setAttribute("aria-selected", t.dataset.cat === cat));
    moveIndicator(); renderCards();
  }
  tabsEl.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    boing(t); destFilter = ""; setCategory(t.dataset.cat);
  });
  $$("[data-filter]").forEach(a => a.addEventListener("click", () => { destFilter = ""; setCategory(a.dataset.filter); }));

  cardsEl.addEventListener("click", e => {
    const f = e.target.closest(".fav"); if (!f) return;
    const on = f.getAttribute("aria-pressed") !== "true";
    f.setAttribute("aria-pressed", on); f.textContent = on ? "♥" : "♡"; f.style.color = on ? "#ff6b81" : "";
    f.classList.remove("on"); void f.offsetWidth; if (on) { f.classList.add("on"); burst(e, f); toast("❤️ Saved to your wishlist"); }
  });

  /* Search */
  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    destFilter = $("#sDest").value;
    setCategory($("#sType").value);
    $("#packages").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    toast("🔎 Showing matching journeys");
  });

  /* ---------------- Departures ---------------- */
  const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const deps = [];
  PACKAGES.forEach(p => p.dates.forEach(d => {
    const m = d.match(/^(\d{2}) (\w{3})$/); if (!m) return;
    const now = new Date(); let dt = new Date(now.getFullYear(), MONTHS[m[2]], +m[1]);
    if (dt < now) dt.setFullYear(dt.getFullYear() + 1);
    deps.push({ p, d, dt });
  }));
  deps.sort((a, b) => a.dt - b.dt);
  $("#departureList").innerHTML = deps.slice(0, 7).map((x, i) => {
    const seats = (x.p.reviews + i * 7) % 14 + 2;
    return `<div class="dep">
      <div class="dep-date">${x.d}<small>${x.dt.getFullYear()} · ${x.p.days} days</small></div>
      <div class="dep-name"><b>${x.p.name}</b><small>${x.p.region} · from ${inr(x.p.price)}</small></div>
      <span class="seats ${seats < 6 ? "low" : "ok"}">${seats < 6 ? `🔥 Only ${seats} seats left` : `${seats} seats open`}</span>
      <a href="#" class="btn btn-primary btn-sm squishy wind-up" data-enquire="${x.p.id}"><span>Enquire</span><i class="arrow">→</i></a>
    </div>`;
  }).join("");

  /* ---------------- Testimonials carousel ---------------- */
  const track = $("#carTrack"), dotsEl = $("#carDots");
  track.innerHTML = TESTIMONIALS.map(t => `
    <article class="review glass">
      <div class="stars">${"★".repeat(t.stars)}</div>
      <p>“${t.text}”</p>
      <div class="who"><span class="avatar">${t.name.split(" ").map(s => s[0]).slice(0, 2).join("")}</span><div><b>${t.name}</b><small>${t.city} · ${t.trip}</small></div></div>
    </article>`).join("");
  dotsEl.innerHTML = TESTIMONIALS.map((_, i) => `<button aria-label="Review ${i + 1}"></button>`).join("");
  const reviews = $$(".review", track), dots = $$("button", dotsEl);
  let carIdx = 0;
  function goTo(i) {
    carIdx = (i + reviews.length) % reviews.length;
    const r = reviews[carIdx];
    track.scrollTo({ left: r.offsetLeft - (track.clientWidth - r.clientWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }
  function syncCar() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = Infinity;
    reviews.forEach((r, i) => { const d = Math.abs(r.offsetLeft + r.clientWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    carIdx = best;
    reviews.forEach((r, i) => r.classList.toggle("dim", i !== best));
    dots.forEach((d, i) => d.classList.toggle("on", i === best));
  }
  track.addEventListener("scroll", () => requestAnimationFrame(syncCar), { passive: true });
  $(".car-btn.prev").addEventListener("click", () => goTo(carIdx - 1));
  $(".car-btn.next").addEventListener("click", () => goTo(carIdx + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
  let auto = setInterval(() => goTo(carIdx + 1), 5500);
  track.addEventListener("pointerenter", () => clearInterval(auto));
  track.addEventListener("pointerleave", () => { clearInterval(auto); auto = setInterval(() => goTo(carIdx + 1), 5500); });
  syncCar();

  /* ---------------- Gallery ---------------- */
  $("#gallery-grid").innerHTML = PACKAGES.slice(0, 7).map(p =>
    `<figure class="g-item reveal" style="--h:${p.hue};margin:0"><img src="${p.img.replace("w=900", "w=700")}" alt="${p.name}" loading="lazy" onerror="this.remove()"/><span>${p.name}</span></figure>`
  ).join("");

  /* ---------------- FAQ ---------------- */
  $("#faqList").innerHTML = FAQS.map((f, i) => `
    <div class="qa glass reveal">
      <button aria-expanded="false" aria-controls="ans${i}">${f.q}<span class="plus" aria-hidden="true">+</span></button>
      <div class="ans" id="ans${i}"><div><p>${f.a}</p></div></div>
    </div>`).join("");
  $("#faqList").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const qa = b.parentElement, open = !qa.classList.contains("open");
    $$(".qa", $("#faqList")).forEach(q => { q.classList.remove("open"); $("button", q).setAttribute("aria-expanded", "false"); });
    if (open) { qa.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
  });

  /* ---------------- CTA form ---------------- */
  $("#ctaPkg").innerHTML = `<option value="">Select a package (optional)</option>` + PACKAGES.map(p => `<option value="${p.id}">${p.name} — ${inr(p.price)}</option>`).join("") + `<option value="custom">Custom / private tour</option>`;
  $("#ctaForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, name = f.name.value.trim();
    if (!name) { f.name.classList.remove("shake"); void f.name.offsetWidth; f.name.classList.add("shake"); f.name.focus(); return; }
    const pkg = byId(f.pkg.value);
    const extra = { name, date: f.date.value, pax: f.pax.value, note: f.note.value.trim() };
    if (f.pkg.value === "custom") extra.custom = true;
    openWhatsApp(pkg, extra, e.submitter || f);
  });
  $("#ctaForm [name=name]").addEventListener("animationend", ev => ev.target.classList.remove("shake"));

  /* ---------------- Modal ---------------- */
  const modal = $("#modal"), mCard = $("#modalCard");
  let lastFocus;
  function openModal(p, evt) {
    if (!p) return;
    lastFocus = document.activeElement;
    if (evt && evt.clientX) { mCard.style.setProperty("--ox", (evt.clientX / innerWidth * 100) + "%"); mCard.style.setProperty("--oy", (evt.clientY / innerHeight * 100) + "%"); }
    mCard.style.setProperty("--h", p.hue);
    mCard.innerHTML = `
      <div class="m-hero" style="--h:${p.hue}">
        <img src="${p.img.replace("w=900", "w=1400")}" alt="" onerror="this.remove()"/>
        <button class="m-close glass squishy" data-close aria-label="Close">✕</button>
        <div class="m-title"><span class="region">${p.region}</span><h3 id="mTitle">${p.name}</h3></div>
      </div>
      <div class="m-body">
        <div class="meta">
          <div><small>Duration</small><b>${p.days}D / ${p.nights}N</b></div>
          <div><small>Altitude</small><b>${p.altitude}</b></div>
          <div><small>Grade</small><b>${p.difficulty}</b></div>
          <div><small>Season</small><b>${p.season}</b></div>
        </div>
        <div><h4>Highlights</h4><div class="pill-list">${p.highlights.map(h => `<span>✦ ${h}</span>`).join("")}</div></div>
        <div class="two-col">
          <div><h4>Day-wise itinerary</h4><ol class="timeline">${p.itinerary.map((d, i) => `<li data-day="${i + 1}" style="--i:${i}">${d}</li>`).join("")}</ol></div>
          <div><h4>Inclusions</h4><ul class="ticks" style="grid-template-columns:1fr">${p.includes.map(x => `<li>${x}</li>`).join("")}</ul>
            <h4>Departures</h4><div class="dates">${p.dates.map(d => `<span>${d}</span>`).join("")}</div></div>
        </div>
      </div>
      <div class="m-foot">
        <div class="price"><small>Starting from</small><s>${inr(p.oldPrice)}</s><b>${inr(p.price)}</b> <em>/ person</em></div>
        <a href="${waLink(p)}" class="btn btn-wa squishy wind-up" data-enquire="${p.id}" target="_blank" rel="noopener"><span>Enquire on WhatsApp</span><i class="arrow">→</i></a>
      </div>`;
    modal.classList.remove("closing");
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".m-close", mCard).focus({ preventScroll: true }), 50);
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.add("closing");
    setTimeout(() => { modal.classList.remove("open", "closing"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; lastFocus && lastFocus.focus({ preventScroll: true }); }, reduced ? 0 : 210);
  }
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------------- Pointer-tracked glass + tilt ---------------- */
  document.addEventListener("pointermove", e => {
    const g = e.target.closest && e.target.closest(".glass"); if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", (e.clientX - r.left) + "px");
    g.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  function bindTilt(els) {
    if (reduced || !matchMedia("(hover: hover)").matches) return;
    els.forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1000px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-6px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; }); // springs back via CSS (follow-through)
    });
  }
  bindTilt($$(".tilt"));

  /* ---------------- Reveal on scroll (staggered) ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
      el.style.setProperty("--d", (Math.max(0, sibs.indexOf(el)) * 90) + "ms");
      el.classList.add("in"); io.unobserve(el);
    });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------------- Count-up stats (slow-in/slow-out) ---------------- */
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, dec = !!el.dataset.decimal, t0 = performance.now(), dur = reduced ? 1 : 1800;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), v = end * easeIO(k);
      el.textContent = dec ? (v / 10).toFixed(1) : Math.round(v).toLocaleString("en-IN");
      if (k < 1) requestAnimationFrame(step); else el.classList.add("pop");
    };
    requestAnimationFrame(step); cio.unobserve(el);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------------- Hero: words + parallax ---------------- */
  $$(".hero-title .word").forEach((w, i) => w.style.setProperty("--i", i));
  requestAnimationFrame(() => $(".hero-title").classList.add("go"));
  const layers = $$(".hero .layer[data-depth]");
  let ticking = false;
  function parallax() {
    const y = scrollY;
    if (y < innerHeight * 1.2) layers.forEach(l => l.style.transform = `translateY(${y * l.dataset.depth}px)`);
    ticking = false;
  }
  if (!reduced) addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });

  /* ---------------- Nav: hide/show, liquid pill, scroll-spy ---------------- */
  const nav = $("#nav"), links = $$(".nav-links a"), pill = $(".nav-pill");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("shrink", y > 40);
    nav.classList.toggle("hide", y > lastY && y > 400 && !$("#navLinks").classList.contains("open"));
    lastY = y;
  }, { passive: true });
  function pillTo(a) {
    if (!a) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1; pill.style.width = a.offsetWidth + "px"; pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  links.forEach(a => a.addEventListener("pointerenter", () => pillTo(a)));
  $("#navLinks").addEventListener("pointerleave", () => pillTo($(".nav-links a.active")));
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    pillTo($(".nav-links a.active"));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const s = $(a.getAttribute("href")); s && spy.observe(s); });

  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open); $("#navLinks").classList.toggle("open", open);
  });
  links.forEach(a => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); $("#navLinks").classList.remove("open"); }));

  /* ---------------- Init ---------------- */
  $("#year").textContent = new Date().getFullYear();
  renderCards();
  requestAnimationFrame(() => moveIndicator(false));
  addEventListener("resize", () => moveIndicator(false));
  document.fonts && document.fonts.ready.then(() => moveIndicator(false));
})();
