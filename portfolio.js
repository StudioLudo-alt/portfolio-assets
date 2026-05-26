function toggleDetail(id, btn) {
  var detail = document.getElementById("detail-" + id);
  var isOpen = detail.classList.contains("open");
  if (!isOpen) {
    document.querySelectorAll(".case-detail.open").forEach(function(d) {
      if (d.id !== "detail-" + id) {
        d.classList.remove("open");
        d.setAttribute("aria-hidden", "true");
        document.querySelectorAll(".case-expand-btn.open").forEach(function(b) {
          if (b !== btn) {
            b.classList.remove("open");
            b.setAttribute("aria-expanded", "false");
            var lbl = b.querySelector("span:not(.case-expand-icon)");
            if (lbl) lbl.textContent = "Lire le cas en detail";
          }
        });
      }
    });
  }
  detail.classList.toggle("open");
  detail.setAttribute("aria-hidden", isOpen ? "true" : "false");
  btn.classList.toggle("open");
  btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  var label = btn.querySelector("span:not(.case-expand-icon)");
  if (label) label.textContent = isOpen ? "Lire le cas en detail" : "Refermer";
  if (!isOpen) setTimeout(function() {
    var NAV_OFFSET = 64;
    var top = detail.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: top, behavior: "smooth" });
  }, 550);
}
function toggleAccord(idx) {
  var item = document.getElementById("accord-" + idx);
  var body = item.querySelector(".accord-body");
  var icon = item.querySelector(".accord-icon");
  var isOpen = item.classList.contains("open");
  document.querySelectorAll(".accord-item").forEach(function(a) {
    a.classList.remove("open");
    var b = a.querySelector(".accord-body");
    if (b) b.style.display = "none";
    var ic = a.querySelector(".accord-icon");
    if (ic) ic.textContent = "+";
  });
  if (!isOpen) { item.classList.add("open"); body.style.display = "block"; icon.textContent = "-"; }
}
window.addEventListener("scroll", function() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("progress-bar").style.width = (window.scrollY / max * 100) + "%";
});
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
document.querySelectorAll(".reveal").forEach(function(el) { observer.observe(el); });
window.addEventListener("load", function() {
  document.querySelectorAll("#hero .reveal").forEach(function(el, i) {
    setTimeout(function() { el.classList.add("visible"); }, 150 + i * 140);
  });
});
function switchGlobal(idx, btn) {
  var allGlobalBtns = Array.from(document.querySelectorAll("[onclick*=\"switchGlobal\"]"));
  allGlobalBtns.forEach(function(b, i) { b.classList.toggle("active", i === idx); });
  document.querySelectorAll(".gtab-panel").forEach(function(p, i) { p.classList.toggle("active", i === idx); });
  var panel = document.getElementById("gtab-" + idx);
  if (panel) {
    panel.querySelectorAll(".camp-item").forEach(function(item, i) { item.classList.toggle("active", i === 0); });
    panel.querySelectorAll(".camp-visual").forEach(function(v, i) { v.classList.toggle("active", i === 0); });
  }
}
function switchCampAct(tab, idx, el) {
  var panel = document.getElementById("gtab-" + tab);
  if (!panel) return;
  panel.querySelectorAll(".camp-item").forEach(function(i) { i.classList.remove("active"); });
  el.classList.add("active");
  panel.querySelectorAll(".camp-visual").forEach(function(v) { v.classList.remove("active"); });
  var vis = panel.querySelector("#gvis-" + tab + "-" + idx);
  if (vis) vis.classList.add("active");
}
function switchCiblee(idx, btn) {
  var allCibleeBtns = Array.from(document.querySelectorAll("[onclick*=\"switchCiblee\"]"));
  allCibleeBtns.forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  document.querySelectorAll(".ctab-panel").forEach(function(p, i) { p.classList.toggle("active", i === idx); });
  var panel = document.getElementById("ctab-" + idx);
  if (panel) {
    panel.querySelectorAll(".camp-item").forEach(function(item, i) { item.classList.toggle("active", i === 0); });
    panel.querySelectorAll(".camp-visual").forEach(function(v, i) { v.classList.toggle("active", i === 0); });
  }
}
function switchCibleeAct(tab, idx, el) {
  var panel = document.getElementById("ctab-" + tab);
  if (!panel) return;
  panel.querySelectorAll(".camp-item").forEach(function(i) { i.classList.remove("active"); });
  el.classList.add("active");
  panel.querySelectorAll(".camp-visual").forEach(function(v) { v.classList.remove("active"); });
  var vis = panel.querySelector("#cvis-" + tab + "-" + idx);
  if (vis) vis.classList.add("active");
}
var biSlideIndex = 0;
function moveBiSlide(dir) { goBiSlide((biSlideIndex + dir + 3) % 3); }
function goBiSlide(idx) {
  biSlideIndex = idx;
  document.querySelectorAll("#bi-slider .bi-slide").forEach(function(s, i) { s.classList.toggle("active", i === idx); });
  document.querySelectorAll("#bi-slider .bi-dot").forEach(function(d, i) { d.classList.toggle("active", i === idx); });
}
function toggleKpi(el) {
  var isActive = el.classList.contains("active");
  document.querySelectorAll(".kpi-acc").forEach(function(a) { a.classList.remove("active"); });
  if (!isActive) el.classList.add("active");
}
function openModal(wrap) {
  var img = wrap.querySelector("img");
  if (!img) return;
  var modal = document.getElementById("mockup-modal");
  modal.querySelector("img").src = img.src;
  modal.querySelector("img").alt = img.alt;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}
function closeModal() {
  document.getElementById("mockup-modal").style.display = "none";
  document.body.style.overflow = "";
}
document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeModal(); });
function switchUX2(idx, btn) {
  document.querySelectorAll("#ux-tab-blocks .tab-block").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  document.querySelectorAll("[id^=\"ux2-panel-\"]").forEach(function(p, i) { p.classList.toggle("active", i === idx); });
}
function lsTab(idx) {
  document.querySelectorAll("#ls-tabs-nav .tab-btn").forEach(function(b, i) { b.classList.toggle("active", i === idx); });
  document.querySelectorAll("[id^=\"ls-panel-\"]").forEach(function(p, i) { p.classList.toggle("active", i === idx); });
}
var frIdx = 0, frTotal = 3;
function frUpdate() {
  document.getElementById("frictions-inner").style.transform = "translateX(-" + frIdx * 100 + "%)";
  document.querySelectorAll(".slider-dot").forEach(function(d, i) { d.classList.toggle("active", i === frIdx); });
  document.getElementById("fr-counter").textContent = (frIdx + 1) + " / " + frTotal;
}
function frSlide(dir) { frIdx = Math.max(0, Math.min(frTotal - 1, frIdx + dir)); frUpdate(); }
function frGo(i) { frIdx = i; frUpdate(); }
function capsTab(idx) {
  document.querySelectorAll("#caps-tabs-nav .tab-btn").forEach(function(b, i) { b.classList.toggle("active", i === idx); });
  document.querySelectorAll("[id^=\"caps-panel-\"]").forEach(function(p, i) { p.classList.toggle("active", i === idx); });
}