/* ============================================================
   PORTAFOLIO_OS — lógica del escritorio
   ============================================================ */

const TYPE_COLOR = { word:"#3E6285", pdf:"#7C3A49", ppt:"#B85530", excel:"#5F8F6C", other:"#8FA79A" };
const TYPE_EXT   = { word:"DOC", pdf:"PDF", ppt:"PPT", excel:"XLS", other:"FILE" };

function getFileType(name){
  const ext = name.split(".").pop().toLowerCase();
  if(["doc","docx"].includes(ext)) return "word";
  if(["pdf"].includes(ext)) return "pdf";
  if(["ppt","pptx"].includes(ext)) return "ppt";
  if(["xls","xlsx"].includes(ext)) return "excel";
  return "other";
}

let zTop = 10;
let openWindows = {}; // id -> {el, taskbarEl}

/* ---------- WELCOME SCREEN + FLASH ---------- */
const welcomeScreen = document.getElementById("welcome-screen");
const desktop = document.getElementById("desktop");
  document.getElementById("open-btn").addEventListener("click", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const created = [];

  const place = (el, x, y) => {
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    created.push(el);
    return el;
  };

  // Portal central que se expande
  const portal = place(Object.assign(document.createElement("div"), {
    className: "portal-core"
  }), "50%", "50%");
  portal.style.left = "0"; portal.style.top = "0";

  // Glow difuso detrás
  const glow = place(Object.assign(document.createElement("div"), {
    className: "portal-glow"
  }), cx, cy);

  // Partículas que flotan hacia arriba en espiral
  const PARTICLE_COUNT = 24;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT;
    const dist = 60 + Math.random() * 140;
    const rise = -120 - Math.random() * 280;
    const drift = (Math.random() - 0.5) * 120;

    const p = document.createElement("div");
    p.className = "portal-particle";
    p.style.setProperty("--dx", Math.cos(angle) * dist + drift + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist * 0.3 + rise + "px");
    // Retraso escalonado para efecto de ola
    p.style.animationDelay = (i * 25) + "ms";
    place(p, cx, cy);
  }

  // Mostrar escritorio con fade suave
  desktop.classList.remove("hidden");
  desktop.classList.add("visible");
  welcomeScreen.classList.add("hide");

  requestAnimationFrame(() => requestAnimationFrame(() => {
    created.forEach((el) => el.classList.add("active"));
  }));

  setTimeout(() => welcomeScreen.remove(), 600);
  setTimeout(() => created.forEach((el) => el.remove()), 1800);
});

/* ---------- VISOR DE PANTALLA COMPLETA (Portada, Presentación, Conclusión, documentos) ---------- */
const fsViewer = document.getElementById("fullscreen-viewer");
const fsIframe = document.getElementById("fs-iframe");
const fsFallback = document.getElementById("fs-fallback");
const fsTitle = document.getElementById("fs-title");
const fsBackBtn = document.getElementById("fs-back-btn");

// Uso simple (una página HTML propia, ej. Portada / Conclusión)
function openFullscreenPage(title, url){
  openFullscreenContent({ title, url });
}

// Uso general: pasa "url" para mostrar un iframe, o "fallbackHTML" para mostrar un aviso en su lugar
function openFullscreenContent({ title, url, fallbackHTML }){
  fsTitle.textContent = title;
  if(url){
    fsIframe.src = url;
    fsIframe.classList.remove("hidden");
    fsFallback.classList.add("hidden");
    fsFallback.innerHTML = "";
  } else {
    fsIframe.src = "about:blank";
    fsIframe.classList.add("hidden");
    fsFallback.innerHTML = fallbackHTML || "";
    fsFallback.classList.remove("hidden");
  }
  fsViewer.classList.remove("hidden");
}

function closeFullscreenPage(){
  fsViewer.classList.add("hidden");
  fsIframe.src = "about:blank";
  fsFallback.innerHTML = "";
}
fsBackBtn.addEventListener("click", closeFullscreenPage);

/* ---------- CLOCK ---------- */
function tickClock(){
  const el = document.getElementById("taskbar-clock");
  if(!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const dias = ["dom","lun","mar","mié","jué","vie","sáb"];
  el.textContent = `${dias[now.getDay()]} · ${h}:${m}`;
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- ABOUT PANEL ---------- */
const startBtn = document.getElementById("start-btn");
const aboutPanel = document.getElementById("about-panel");
startBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  aboutPanel.classList.toggle("show");
});
document.getElementById("about-close").addEventListener("click", () => aboutPanel.classList.remove("show"));

/* ---------- BUILD DESKTOP FOLDER ICONS ---------- */
const iconsGrid = document.getElementById("icons-grid");

// Cuenta archivos reales (ignora subcarpetas de solo-contenido, como Bitácoras)
function countItems(folder){
  if(folder.type === "files") return folder.items.length;
  if(folder.type === "folders") return folder.subfolders.reduce((n,s) => n + (s.items ? s.items.length : 0), 0);
  return 0;
}

// Etiqueta de conteo: distingue archivos / páginas de contenido / bitácoras
function countLabel(folder){
  if(folder.type === "page") return "página";
  if(folder.type === "folders"){
    const allContentOnly = folder.subfolders.every(s => !s.items);
    if(allContentOnly){
      const n = folder.subfolders.length;
      return `${n} entrada${n===1?"":"s"}`;
    }
  }
  const count = countItems(folder);
  return `${count} archivo${count===1?"":"s"}`;
}

const FOLDER_TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5];

FOLDERS.forEach((folder, i) => {
  const icon = document.createElement("div");
  icon.className = "folder-icon";
  icon.tabIndex = 0;
  const num = String(i + 1).padStart(2, "0");
  const stampWord = folder.type === "page" ? "LEER" : "ABRIR";
  const tilt = FOLDER_TILTS[i % FOLDER_TILTS.length];
  icon.style.setProperty("--folder-color", folder.color);
  icon.style.setProperty("--tilt", tilt + "deg");
  icon.style.setProperty("--i", i);
  icon.innerHTML = `
    <div class="folder-number">${num}</div>
    <div class="folder-stamp">${stampWord}</div>
    <div class="folder-label">${folder.label}</div>
    <div class="folder-count">${countLabel(folder)}</div>
  `;

  bindDoubleClick([icon], () => {
    if(folder.type === "page" && folder.page){
      openFullscreenPage(folder.label, folder.page);
    } else {
      openFolderWindow(folder.id);
    }
  });
  icon.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".folder-icon").forEach(i => i.classList.remove("selected"));
    icon.classList.add("selected");
  });
  icon.addEventListener("keydown", e => { if(e.key === "Enter") openFolderWindow(folder.id); });

  iconsGrid.appendChild(icon);
});

/* ---------- DOUBLE CLICK HELPER ---------- */
function bindDoubleClick(elements, callback){
  elements.forEach(el => {
    let timer = null;
    el.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que el clic "cierre" la ventana al reemplazar su contenido
      if(timer){ clearTimeout(timer); timer = null; callback(el); }
      else { timer = setTimeout(() => timer = null, 320); }
    });
  });
}

/* ---------- WINDOW MANAGEMENT (generic) ---------- */
function createWindow({ id, title, accent, width, height, left, top }){
  if(openWindows[id]){
    focusWindow(id);
    return openWindows[id].el;
  }

  const win = document.createElement("div");
  win.className = "os-window opening";
  win.style.width = width + "px";
  win.style.height = height + "px";
  win.style.left = left + "px";
  win.style.top = top + "px";
  win.style.zIndex = ++zTop;

  win.innerHTML = `
    <div class="win-titlebar">
      <span class="win-dot" style="background:${accent || "var(--brass)"}; color:${accent || "var(--brass)"}"></span>
      <div class="win-title">${title}</div>
      <div class="win-controls">
        <button class="win-btn maximize" title="Maximizar">⤢</button>
        <button class="win-btn close" title="Cerrar">✕</button>
      </div>
    </div>
    <div class="win-body"></div>
    <div class="win-resize"></div>
  `;

  document.getElementById("windows-container").appendChild(win);

  win.addEventListener("mousedown", (e) => { e.stopPropagation(); focusWindow(id); });

  win.querySelector(".win-btn.close").addEventListener("click", (e) => {
    e.stopPropagation();
    closeWindow(id);
  });

  let maximized = false, prevRect = null;
  win.querySelector(".win-btn.maximize").addEventListener("click", (e) => {
    e.stopPropagation();
    if(!maximized){
      prevRect = { left:win.style.left, top:win.style.top, width:win.style.width, height:win.style.height };
      win.style.left = "10px"; win.style.top = "10px";
      win.style.width = "calc(100% - 20px)"; win.style.height = "calc(100% - 74px)";
    } else if(prevRect){
      win.style.left = prevRect.left; win.style.top = prevRect.top;
      win.style.width = prevRect.width; win.style.height = prevRect.height;
    }
    maximized = !maximized;
  });

  makeDraggable(win, win.querySelector(".win-titlebar"));
  makeResizable(win, win.querySelector(".win-resize"));

  const taskItem = document.createElement("div");
  taskItem.className = "taskbar-item active";
  taskItem.textContent = title;
  taskItem.addEventListener("click", (e) => {
    e.stopPropagation();
    win.style.display = "flex";
    focusWindow(id);
  });
  document.getElementById("taskbar-open").appendChild(taskItem);

  openWindows[id] = { el: win, taskbarEl: taskItem };
  focusWindow(id);
  return win;
}

function focusWindow(id){
  Object.entries(openWindows).forEach(([wid, w]) => {
    w.el.classList.toggle("focused", wid === id);
    w.taskbarEl.classList.toggle("active", wid === id);
  });
  if(openWindows[id]) openWindows[id].el.style.zIndex = ++zTop;
}

function closeWindow(id){
  const w = openWindows[id];
  if(!w) return;
  w.el.classList.add("closing");
  w.taskbarEl.remove();
  setTimeout(() => w.el.remove(), 170);
  delete openWindows[id];
}

function closeAllWindows(){
  Object.keys(openWindows).forEach(id => closeWindow(id));
}

/* Click anywhere on the empty desktop closes floating windows */
desktop.addEventListener("click", (e) => {
  if(e.target.closest(".os-window") || e.target.closest(".folder-icon") ||
     e.target.closest(".taskbar") || e.target.closest(".about-panel")) return;
  closeAllWindows();
  aboutPanel.classList.remove("show");
  document.querySelectorAll(".folder-icon").forEach(i => i.classList.remove("selected"));
});

function makeDraggable(win, handle){
  let dragging = false, offX = 0, offY = 0;
  handle.addEventListener("mousedown", (e) => {
    dragging = true;
    offX = e.clientX - win.offsetLeft;
    offY = e.clientY - win.offsetTop;
  });
  document.addEventListener("mousemove", (e) => {
    if(!dragging) return;
    win.style.left = Math.max(0, e.clientX - offX) + "px";
    win.style.top = Math.max(0, e.clientY - offY) + "px";
  });
  document.addEventListener("mouseup", () => dragging = false);
}

function makeResizable(win, handle){
  let resizing = false, startX, startY, startW, startH;
  handle.addEventListener("mousedown", (e) => {
    resizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = win.offsetWidth; startH = win.offsetHeight;
    e.stopPropagation();
  });
  document.addEventListener("mousemove", (e) => {
    if(!resizing) return;
    win.style.width = Math.max(320, startW + (e.clientX - startX)) + "px";
    win.style.height = Math.max(200, startH + (e.clientY - startY)) + "px";
  });
  document.addEventListener("mouseup", () => resizing = false);
}

/* ---------- FOLDER / PATH HELPERS ---------- */
function getTopFolder(topId){ return FOLDERS.find(f => f.id === topId); }
function getNode(path){
  const top = getTopFolder(path[0]);
  if(path.length === 1) return top;
  return top.subfolders.find(s => s.id === path[1]);
}
function pathSegments(path){
  const top = getTopFolder(path[0]);
  const segs = [top.path];
  if(path.length === 2){
    const sub = top.subfolders.find(s => s.id === path[1]);
    segs.push(sub.path);
  }
  return segs;
}

/* ---------- OPEN A FOLDER WINDOW ---------- */
function openFolderWindow(topId){
  const top = getTopFolder(topId);
  const id = "folder-" + topId;

  const win = createWindow({
    id, title: top.label, accent: top.color,
    width: 640, height: 480,
    left: 160 + Object.keys(openWindows).length * 26,
    top: 90 + Object.keys(openWindows).length * 22
  });

  renderWindowBody(win, [topId]);
}

function renderWindowBody(win, path){
  const top = getTopFolder(path[0]);
  const node = getNode(path);

  win.dataset.path = JSON.stringify(path);
  win.querySelector(".win-title").textContent = path.length === 2 ? `${top.label} / ${node.label}` : top.label;

  let breadcrumbHTML = `<div class="breadcrumb">
      ${path.length === 2 ? `<button class="back-btn" type="button">← Atrás</button>` : ""}
      <span class="crumb-label">${top.label}${path.length === 2 ? " / " + node.label : ""}</span>
    </div>`;

  let contentHTML = "";

  if(top.type === "page" && path.length === 1){
    // Carpeta de una sola página (ej. Conclusión): HTML externo o contenido inline
    if(top.page){
      contentHTML = `<div class="page-frame"><iframe src="${top.page}" title="${top.label}"></iframe></div>`;
    } else {
      contentHTML = `<div class="page-content">${top.content}</div>`;
    }

  } else if(top.type === "folders" && path.length === 1){
    // Lista de subcarpetas: archivos, contenido inline (Bitácoras) o página HTML externa (Portada)
    contentHTML = `<div class="file-grid">` + top.subfolders.map(sf => `
      <div class="file-icon subfolder" data-nav="${sf.id}">
        <div class="folder-glyph" style="--folder-color:${top.color}"></div>
        <div class="file-name">${sf.label}</div>
        <div class="file-desc">${(sf.content || sf.page) ? "página" : (sf.items.length + " archivo" + (sf.items.length===1?"":"s"))}</div>
      </div>
    `).join("") + `</div>`;

  } else if(path.length === 2 && node.page){
    // Subcarpeta que abre una página HTML externa (ej. Portada, Presentación del Estudiante)
    contentHTML = `<div class="page-frame"><iframe src="${node.page}" title="${node.label}"></iframe></div>`;

  } else if(path.length === 2 && node.content){
    // Subcarpeta de tipo "página" inline (ej. cada Bitácora)
    contentHTML = `<div class="page-content">${node.content}</div>`;

  } else {
    // Subcarpeta de archivos normales
    const items = node.items || [];
    if(items.length === 0){
      contentHTML = `<div class="empty-folder">Esta carpeta está vacía todavía.<br>Copia tus archivos dentro de <code>files/</code> y regístralos en <code>data.js</code> — mira el <code>README.md</code> para el paso a paso.</div>`;
    } else {
      contentHTML = `<div class="file-grid">` + items.map((item, i) => {
        const type = getFileType(item.name);
        return `<div class="file-icon" data-file-index="${i}">
          <div class="file-glyph" data-ext="${TYPE_EXT[type]}" style="--file-color:${TYPE_COLOR[type]}"><span class="fold"></span></div>
          <div class="file-name">${item.label}</div>
          ${item.desc ? `<div class="file-desc">${item.desc}</div>` : ""}
        </div>`;
      }).join("") + `</div>`;
    }
  }

  const body = win.querySelector(".win-body");
  body.innerHTML = breadcrumbHTML + contentHTML;

  const backBtn = body.querySelector(".back-btn");
  if(backBtn){
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      renderWindowBody(win, [path[0]]);
    });
  }

  bindDoubleClick(body.querySelectorAll(".file-icon.subfolder"), (el) => {
    const sf = top.subfolders.find(s => s.id === el.dataset.nav);
    if(sf && sf.page){
      openFullscreenPage(sf.label, sf.page);
    } else {
      renderWindowBody(win, [path[0], el.dataset.nav]);
    }
  });

  bindDoubleClick(body.querySelectorAll(".file-icon:not(.subfolder)"), (el) => {
    const idx = parseInt(el.dataset.fileIndex);
    openFileViewer(path, idx);
  });
}

/* ---------- ABRIR UN DOCUMENTO (PDF / Word / Excel / PPT) EN PANTALLA COMPLETA ---------- */
function openFileViewer(path, index){
  const node = getNode(path);
  const item = node.items[index];
  if(!item) return;

  const type = getFileType(item.name);
  const segs = pathSegments(path);
  const encodedPath = "files/" + segs.map(encodeURIComponent).join("/") + "/" + encodeURIComponent(item.name);
  const absoluteURL = new URL(encodedPath, window.location.href).href;

  if(type === "pdf"){
    openFullscreenContent({ title: item.label, url: encodedPath });

  } else if(["word","ppt","excel"].includes(type)){
    const isLocal = ["localhost","127.0.0.1",""].includes(window.location.hostname);
    if(isLocal){
      openFullscreenContent({ title: item.label, fallbackHTML: `
        <div class="viewer-fallback">
          <strong>Vista previa no disponible en local</strong>
          <p class="viewer-note">Este archivo (${item.name}) se visualiza con el visor de Office Online, que solo funciona una vez el sitio esté publicado en una URL pública (GitHub Pages / Netlify).</p>
          <a href="${encodedPath}" target="_blank" rel="noopener">Abrir archivo directamente</a>
        </div>
      `});
    } else {
      const viewerURL = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteURL)}`;
      openFullscreenContent({ title: item.label, url: viewerURL });
    }

  } else {
    openFullscreenContent({ title: item.label, fallbackHTML: `
      <div class="viewer-fallback">
        <strong>Tipo de archivo no reconocido</strong>
        <a href="${encodedPath}" target="_blank" rel="noopener">Abrir archivo directamente</a>
      </div>
    `});
  }
}
