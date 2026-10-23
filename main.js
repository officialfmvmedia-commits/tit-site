/* ============================================================
   $TIT — set the contract address here at launch. That's it.
   Leave it as "" until the real CA exists. Never guess one.
   ============================================================ */
const CA = "";

(function () {
  "use strict";
  const live = typeof CA === "string" && CA.trim().length > 30;
  const ca = live ? CA.trim() : "";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // --- CA module -------------------------------------------------
  const box = $(".ca");
  const value = $("[data-ca]");
  const copyBtn = $("[data-copy]");
  const copyLabel = $("[data-copy-label]");
  const note = $("[data-ca-note]");
  const toast = $(".toast");
  let toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  if (live) {
    value.textContent = ca;
    value.title = ca;
    copyBtn.disabled = false;
    copyBtn.removeAttribute("aria-disabled");
    note.textContent = "This is the only official $TIT contract address.";
    const short = ca.slice(0, 4) + "…" + ca.slice(-4);
    $$("[data-ca-short]").forEach((el) => (el.textContent = short));
    const url = "https://pump.fun/coin/" + encodeURIComponent(ca);
    $$("[data-buy]").forEach((a) => {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.removeAttribute("aria-disabled");
    });
    $$("[data-buy-label]").forEach((el) => (el.textContent = "$TIT"));
    $$("[data-buy-tag]").forEach((el) => el.remove());
  } else {
    box.classList.add("is-pending");
    $$("[data-buy]").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("CA drops here at launch");
        const target = document.getElementById("ca");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      })
    );
  }

  async function copyCA() {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(ca);
    } catch (_) {
      const t = document.createElement("textarea");
      t.value = ca;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch (_) {}
      t.remove();
    }
    copyLabel.textContent = "Copied";
    showToast("CA copied");
    setTimeout(() => (copyLabel.textContent = "Copy"), 1600);
  }
  copyBtn.addEventListener("click", copyCA);

  // --- Boop the dome ---------------------------------------------
  const dome = $(".dome");
  const boop = $(".boop");
  const words = ["boop", "trade", "internet", "trends", "$TIT", "wagmi", "jiggle"];
  let n = 0;
  dome.addEventListener("click", () => {
    dome.classList.remove("jiggle");
    void dome.offsetWidth;
    dome.classList.add("jiggle");
    boop.textContent = words[n++ % words.length];
    boop.classList.remove("show");
    void boop.offsetWidth;
    boop.classList.add("show");
  });
  dome.addEventListener("animationend", (e) => {
    if (e.animationName === "jiggle") dome.classList.remove("jiggle");
  });

  // --- Scroll reveal ---------------------------------------------
  const targets = $$(".section-head, .acro__card, .equation, .lore__close, .step, .warn, .socials");
  if ("IntersectionObserver" in window) {
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
  }
})();
