document.addEventListener("DOMContentLoaded", () => {
  /* ---- reveal-on-scroll ---- */
  const sections = document.querySelectorAll(".split-col");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((s) => s.classList.add("show"));
  }

  /* ---- slider ---- */
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;
  let timerId = null;

  function showSlide(i) {
    const len = slides.length;
    if (!len) return; // no slides on this page
    index = ((i % len) + len) % len; // safe modulo
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  }

  if (slides.length) {
    showSlide(0);
    dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));
    // Auto slide every 4s
    timerId = setInterval(() => showSlide(index + 1), 4000);

    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (timerId) clearInterval(timerId);
        timerId = null;
      } else if (!timerId) {
        timerId = setInterval(() => showSlide(index + 1), 4000);
      }
    });
  }

  /* ---- full-screen menu (top-down) ---- */
  const sideMenu = document.getElementById("sideMenu");
  const openBtns = [
    document.getElementById("openMenu"),
    document.getElementById("openMenuFooter"),
  ].filter(Boolean);
  const closeBtn = document.getElementById("closeMenu");

  const openMenuFn = (btn) => {
    if (!sideMenu) return;
    sideMenu.classList.add("active");
    sideMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    if (btn) btn.classList.add("is-open");
  };
  const closeMenuFn = () => {
    if (!sideMenu) return;
    sideMenu.classList.remove("active");
    sideMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    openBtns.forEach((b) => b && b.classList.remove("is-open"));
  };

  openBtns.forEach((btn) =>
    btn.addEventListener("click", () => openMenuFn(btn))
  );
  if (closeBtn) closeBtn.addEventListener("click", closeMenuFn);
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      sideMenu &&
      sideMenu.classList.contains("active")
    ) {
      closeMenuFn();
    }
  });
});

(function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".menu-card");

  function applyFilter(category) {
    cards.forEach((card) => {
      const cats = (card.getAttribute("data-category") || "").split(/\s+/);
      const show = category === "all" || cats.includes(category);
      card.style.display = show ? "" : "none";
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter(btn.dataset.filter);
    });
  });
})();

// Prevent past dates (sets min to today in local time)
(function () {
  const input = document.getElementById("date");
  if (!input) return;
  const today = new Date();
  // format YYYY-MM-DD
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  input.min = `${yyyy}-${mm}-${dd}`;
})();

// Basic client-side validation UX
(function () {
  const form = document.querySelector(".reserve-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.querySelectorAll(":invalid")[0]?.focus();
    }
  });
})();
