(function () {
"use strict";
var MOTION_KEY = "panurge-motion";
var THEME_KEY = "panurge-theme";
function isMotionOn() {
return document.documentElement.dataset.motion !== "off";
}
function isDark() {
var t = document.documentElement.dataset.theme;
if (t) return t === "dark";
return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function syncMotionUI() {
var on = isMotionOn();
document.querySelectorAll("[data-motion-toggle]").forEach(function (btn) {
btn.setAttribute("aria-pressed", String(on));
var state = btn.querySelector("[data-motion-state]");
if (state) state.textContent = on ? "on" : "off";
});
}
document.querySelectorAll("[data-motion-toggle]").forEach(function (btn) {
btn.addEventListener("click", function () {
if (isMotionOn()) {
document.documentElement.dataset.motion = "off";
try { localStorage.setItem(MOTION_KEY, "off"); } catch (e) {}
document.querySelectorAll(".reveal").forEach(function (el) {
el.classList.add("visible");
});
} else {
delete document.documentElement.dataset.motion;
try { localStorage.setItem(MOTION_KEY, "on"); } catch (e) {}
}
syncMotionUI();
});
});
syncMotionUI();
function syncThemeUI() {
var dark = isDark();
document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
btn.setAttribute("aria-pressed", String(dark));
var state = btn.querySelector("[data-theme-state]");
if (state) state.textContent = dark ? "on" : "off";
});
}
document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
btn.addEventListener("click", function () {
var next = isDark() ? "light" : "dark";
document.documentElement.dataset.theme = next;
try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
syncThemeUI();
});
});
syncThemeUI();
var revealObs = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("visible");
revealObs.unobserve(entry.target);
}
});
},
{ threshold: 0.1, rootMargin: "0px 0px -28px 0px" }
);
document.querySelectorAll(".reveal").forEach(function (el, i) {
el.style.transitionDelay = (i % 8) * 0.045 + "s";
revealObs.observe(el);
});
if (!isMotionOn()) {
document.querySelectorAll(".reveal").forEach(function (el) {
el.classList.add("visible");
});
}
var canTilt =
window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canTilt) {
var raf = 0;
document.addEventListener("pointermove", function (e) {
if (!isMotionOn()) return;
var target = e.target.closest("[data-tilt]");
if (!raf) {
raf = requestAnimationFrame(function () {
raf = 0;
document.querySelectorAll("[data-tilt]").forEach(function (el) {
if (el !== target) el.style.transform = "";
});
if (!target) return;
var r = target.getBoundingClientRect();
var x = (e.clientX - r.left) / r.width;
var y = (e.clientY - r.top) / r.height;
var tiltX = (0.5 - y) * 6.5;
var tiltY = (x - 0.5) * 8.5;
target.style.transform =
"perspective(920px) rotateX(" +
tiltX +
"deg) rotateY(" +
tiltY +
"deg) scale3d(1.012,1.012,1.012)";
});
}
});
document.addEventListener("pointerleave", function () {
document.querySelectorAll("[data-tilt]").forEach(function (el) {
el.style.transform = "";
});
});
}
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
a.addEventListener("click", function (e) {
var id = a.getAttribute("href");
if (!id || id.length < 2) return;
var el = document.querySelector(id);
if (!el) return;
e.preventDefault();
el.scrollIntoView({
behavior: isMotionOn() ? "smooth" : "auto",
block: "start",
});
});
});
var sections = document.querySelectorAll("section[id]");
var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if (sections.length && navAnchors.length) {
window.addEventListener(
"scroll",
function () {
var current = "";
sections.forEach(function (section) {
if (window.scrollY >= section.offsetTop - 120) {
current = section.getAttribute("id") || "";
}
});
navAnchors.forEach(function (link) {
var match = link.getAttribute("href") === "#" + current;
link.classList.toggle("is-active", match);
});
},
{ passive: true }
);
}
})();
(function () {
try {
if (!localStorage.getItem("panurge-theme")) {
var mq = window.matchMedia("(prefers-color-scheme: dark)");
var apply = function () {
document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
var dark = mq.matches;
btn.setAttribute("aria-pressed", String(dark));
var state = btn.querySelector("[data-theme-state]");
if (state) state.textContent = dark ? "on" : "off";
});
};
if (mq.addEventListener) mq.addEventListener("change", apply);
else if (mq.addListener) mq.addListener(apply);
}
} catch (e) {}
})();
document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
if (!a.getAttribute("rel")) {
a.setAttribute("rel", "noopener noreferrer");
}
});
