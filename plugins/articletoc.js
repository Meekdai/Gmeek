(function () {
  if (window.__GmeekTocReady) return;
  window.__GmeekTocReady = true;
  console.log("🍏 articletoc 插件已启用 https://code.buxiantang.top/");

  const TOC_STYLE = `
    :root {
      --toc-bg: rgba(255,255,255,0.8);
      --toc-border: #e1e4e8;
      --toc-text: #24292e;
      --toc-hover: rgba(0,0,0,0.05);
      --toc-icon-bg: rgba(255,255,255,0.8);
      --toc-icon-color: #333;
      --toc-icon-active-bg: #fff;
      --toc-icon-active-color: #333;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --toc-bg: rgba(45, 51, 59, 0.8);
        --toc-border: #444c56;
        --toc-text: #adbac7;
        --toc-hover: rgba(255, 255, 255, 0.05);
        --toc-icon-bg: rgba(45, 51, 59, 0.8);
        --toc-icon-color: #adbac7;
        --toc-icon-active-bg: #2d333b;
        --toc-icon-active-color: #adbac7;
      }
    }
    .toc {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 250px;
      max-height: 70vh;
      background-color: var(--toc-bg);
      border: 1px solid var(--toc-border);
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow-y: auto;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      backdrop-filter: blur(5px);
    }
    .toc.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .toc a {
      display: block;
      color: var(--toc-text);
      text-decoration: none;
      padding: 5px 0;
      font-size: 14px;
      line-height: 1.5;
      border-bottom: 1px solid var(--toc-border);
      transition: background-color 0.2s ease, padding-left 0.2s ease;
    }
    .toc a:last-child { border-bottom: none; }
    .toc a:hover {
      background-color: var(--toc-hover);
      padding-left: 5px;
    }
    .toc-icon {
      position: fixed;
      bottom: 20px;
      right: 15px;
      cursor: pointer;
      background-color: var(--toc-icon-bg);
      color: var(--toc-icon-color);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1001;
      transition: all 0.3s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }
    .toc-icon:hover {
      transform: scale(1.1);
      background-color: var(--toc-icon-active-bg);
    }
    .toc-icon:active {
      transform: scale(0.9);
    }
    .toc-icon.active {
      background-color: var(--toc-icon-active-bg);
      color: var(--toc-icon-active-color);
    }
    .toc-icon svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @media (max-width: 768px) {
      .toc { width: 200px; bottom: 70px; right: 10px; }
      .toc-icon { width: 40px; height: 40px; bottom: 15px; right: 15px; }
      .toc-icon svg { width: 20px; height: 20px; }
    }
  `;

  injectStyle(TOC_STYLE);
  createTocIcon();
  observeMarkdown();

  function injectStyle(cssText) {
    const style = document.createElement("style");
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  function createTocIcon() {
    const icon = document.createElement("div");
    icon.className = "toc-icon";
    icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    icon.onclick = (e) => {
      e.stopPropagation();
      toggleTOC();
    };
    document.body.appendChild(icon);
    document.addEventListener("click", (e) => {
      const toc = document.querySelector(".toc");
      if (toc && toc.classList.contains("show") && !toc.contains(e.target) && !e.target.classList.contains("toc-icon")) {
        toggleTOC();
      }
    });
  }

  function observeMarkdown() {
    const container = document.querySelector(".markdown-body");
    if (!container) return;

    const observer = new MutationObserver(() => {
      const headings = container.querySelectorAll("h1,h2,h3,h4,h5,h6");
      if (headings.length > 0) {
        renderTOC(container, headings);
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
  }

  function renderTOC(container, headings) {
    if (document.querySelector(".toc")) return;

    const toc = document.createElement("div");
    toc.className = "toc";
    headings.forEach((h) => {
      if (!h.id) h.id = h.textContent.trim().replace(/\s+/g, "-").toLowerCase();
      const link = document.createElement("a");
      link.href = "#" + h.id;
      link.textContent = h.textContent;
      link.style.paddingLeft = `${(parseInt(h.tagName[1]) - 1) * 10}px`;
      link.onclick = (e) => {
        e.preventDefault();
        document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
        toggleTOC();
      };
      toc.appendChild(link);
    });
    container.appendChild(toc);
  }

  function toggleTOC() {
    const toc = document.querySelector(".toc");
    const icon = document.querySelector(".toc-icon");
    if (!toc || !icon) return;
    toc.classList.toggle("show");
    icon.classList.toggle("active");
    icon.innerHTML = toc.classList.contains("show")
      ? '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  }
})();
