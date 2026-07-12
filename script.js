/* ============================================================
   PORTAFOLIO_OS — lógica del escritorio
   ============================================================ */

const TYPE_COLOR = { word:"#5C7FE0", pdf:"#C9576F", ppt:"#D98A4E", excel:"#3FAE84", other:"#6B7280" };
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
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const flash = document.createElement("div");
  flash.className = "flash-burst";
  flash.style.left = x + "px";
  flash.style.top = y + "px";
  document.body.appendChild(flash);

  desktop.classList.remove("hidden");
  welcomeScreen.classList.add("hide");

  requestAnimationFrame(() => requestAnimationFrame(() => flash.classList.add("active")));

  setTimeout(() => welcomeScreen.remove(), 450);
  setTimeout(() => flash.remove(), 950);
});

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

function countItems(folder){
  if(folder.type === "files") return folder.items.length;
  if(folder.type === "folders") return folder.subfolders.reduce((n,s) => n + s.items.length, 0);
  return 0;
}

FOLDERS.forEach((folder) => {
  const icon = document.createElement("div");
  icon.className = "folder-icon";
  icon.tabIndex = 0;
  const count = countItems(folder);
  const countLabel = folder.type === "page" ? "página" : `${count} archivo${count===1?"":"s"}`;
  icon.innerHTML = `
    <div class="folder-glyph" style="--folder-color:${folder.color}"></div>
    <div class="folder-label">${folder.label}</div>
    <div class="folder-count">${countLabel}</div>
  `;

  bindDoubleClick([icon], () => openFolderWindow(folder.id));
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
    el.addEventListener("click", () => {
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
      <span class="win-dot" style="background:${accent || "var(--gold)"}"></span>
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
    width: 560, height: 410,
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
      <span class="crumb${path.length===1?" current":""}" data-path='${JSON.stringify([path[0]])}'>${top.label}</span>
      ${path.length===2 ? `<span class="crumb-sep">/</span><span class="crumb current">${node.label}</span>` : ""}
    </div>`;

  let contentHTML = "";

  if(top.type === "page" && path.length === 1){
    contentHTML = `<div class="page-content">${top.content}</div>`;
  } else if(top.type === "folders" && path.length === 1){
    contentHTML = `<div class="file-grid">` + top.subfolders.map(sf => `
      <div class="file-icon subfolder" data-nav="${sf.id}">
        <div class="folder-glyph" style="--folder-color:${top.color}"></div>
        <div class="file-name">${sf.label}</div>
        <div class="file-desc">${sf.items.length} archivo${sf.items.length===1?"":"s"}</div>
      </div>
    `).join("") + `</div>`;
  } else {
    const items = node.items || [];
    if(items.length === 0){
      contentHTML = `<div class="empty-folder">Esta carpeta está vacía todavía.<br>Copia tus archivos dentro de <code>files/</code> y regístralos en <code>data.js</code> — mira el <code>README.md</code> para el paso a paso.</div>`;
    } else {
      contentHTML = `<div class="file-grid">` + items.map((item, i) => {
        const type = getFileType(item.name);
        return `<div class="file-icon" data-file-index="${i}">
          <div class="file-glyph" data-ext="${TYPE_EXT[type]}" style="--file-color:${TYPE_COLOR[type]}"></div>
          <div class="file-name">${item.label}</div>
          ${item.desc ? `<div class="file-desc">${item.desc}</div>` : ""}
        </div>`;
      }).join("") + `</div>`;
    }
  }

  const body = win.querySelector(".win-body");
  body.innerHTML = breadcrumbHTML + contentHTML;

  body.querySelectorAll(".crumb[data-path]").forEach(c => {
    c.addEventListener("click", (e) => {
      e.stopPropagation();
      renderWindowBody(win, JSON.parse(c.dataset.path));
    });
  });

  bindDoubleClick(body.querySelectorAll(".file-icon.subfolder"), (el) => {
    renderWindowBody(win, [path[0], el.dataset.nav]);
  });

  bindDoubleClick(body.querySelectorAll(".file-icon:not(.subfolder)"), (el) => {
    const idx = parseInt(el.dataset.fileIndex);
    openFileViewer(path, idx);
  });
}

/* ---------- OPEN A FILE VIEWER WINDOW ---------- */
function openFileViewer(path, index){
  const node = getNode(path);
  const item = node.items[index];
  if(!item) return;

  const type = getFileType(item.name);
  const segs = pathSegments(path);
  const encodedPath = "files/" + segs.map(encodeURIComponent).join("/") + "/" + encodeURIComponent(item.name);
  const absoluteURL = new URL(encodedPath, window.location.href).href;

  const id = "file-" + path.join("-") + "-" + index;
  let bodyHTML;

  if(type === "pdf"){
    bodyHTML = `<div class="viewer-body"><iframe src="${encodedPath}" title="${item.label}"></iframe></div>`;
  } else if(["word","ppt","excel"].includes(type)){
    const isLocal = ["localhost","127.0.0.1",""].includes(window.location.hostname);
    if(isLocal){
      bodyHTML = `<div class="viewer-fallback">
        <strong>Vista previa no disponible en local</strong>
        <p class="viewer-note">Este archivo (${item.name}) se visualiza con el visor de Office Online, que solo funciona una vez el sitio esté publicado en una URL pública (GitHub Pages / Netlify).</p>
        <a href="${encodedPath}" target="_blank" rel="noopener">Abrir archivo directamente</a>
      </div>`;
    } else {
      const viewerURL = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteURL)}`;
      bodyHTML = `<div class="viewer-body"><iframe src="${viewerURL}" title="${item.label}"></iframe></div>`;
    }
  } else {
    bodyHTML = `<div class="viewer-fallback"><strong>Tipo de archivo no reconocido</strong><a href="${encodedPath}" target="_blank" rel="noopener">Abrir archivo directamente</a></div>`;
  }

  const win = createWindow({
    id, title: item.label, accent: TYPE_COLOR[type],
    width: 760, height: 580,
    left: 220 + Object.keys(openWindows).length * 26,
    top: 60 + Object.keys(openWindows).length * 22
  });
  win.querySelector(".win-body").innerHTML = bodyHTML;
}