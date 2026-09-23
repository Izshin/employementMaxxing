/* Mini-gestor de candidaturas. Persistencia en localStorage. */

const STORE_KEY = 'employmentmaxxing.ofertas.v1';
const THEME_KEY = 'employmentmaxxing.tema.v1';
const PALETTE = ['#5a2d82', '#0046ad', '#e8542f', '#00a0a0', '#d63384', '#2f7d32', '#f0a202', '#3f51b5'];

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.title = theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
}

/* Deriva un segundo color de marca (nunca un tile de un solo color). */
function hexToHsl(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function brandPair(offer) {
  const base = offer.color || PALETTE[0];
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const [h, s, l] = hexToHsl(base);
  // En modo claro los colores de marca se realzan para que no se vean apagados sobre fondo blanco.
  const s1 = isLight ? Math.max(s, 0.7) : s;
  const l1 = isLight ? Math.min(Math.max(l, 0.46), 0.58) : l;
  const b1 = isLight ? hslToHex(h, s1, l1) : base;
  const s2 = Math.min(s1 + 0.1, 0.92);
  const l2 = isLight ? Math.min(Math.max(l1, 0.46), 0.58) : Math.max(Math.min(l, 0.62), 0.32);
  const b2 = hslToHex(h + 140, s2, l2);
  return { b1, b2 };
}

const $ = (sel) => document.querySelector(sel);

let state = loadState();
let filterEstado = 'todas';
let query = '';
let detailId = null;
let detailMode = 'view';

/* ---------------------------------------------------------------- estado */

// Repara rutas de CV guardadas en localStorage que apuntaban a carpetas ya renombradas/inexistentes.
const PATH_FIXES = [
  ['curriculum_exportado_mod', 'curriculum_mod_pdf'],
  ['CvModificable/', 'CvModificables/'],
];

function migrateOfferPaths(offers) {
  for (const o of offers || []) {
    if (!o.cv) continue;
    for (const [oldStr, newStr] of PATH_FIXES) {
      if (o.cv.ruta) o.cv.ruta = o.cv.ruta.replace(oldStr, newStr);
      if (o.cv.fuente) o.cv.fuente = o.cv.fuente.replace(oldStr, newStr);
    }
  }
  return offers;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      migrateOfferPaths(parsed.offers);
      return parsed;
    }
  } catch (e) {
    console.warn('No se pudo leer el almacenamiento local:', e);
  }
  return { offers: JSON.parse(JSON.stringify(DEFAULT_OFFERS)) };
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function getOffer(id) {
  return state.offers.find((o) => o.id === id);
}

function estadoInfo(id) {
  return ESTADOS.find((e) => e.id === id) || ESTADOS[0];
}

const variantVar = (variant) => `var(--st-${variant})`;

function noteVariant(text) {
  const t = String(text || '').toUpperCase();
  if (t.includes('PUNTO DÉBIL') || t.startsWith('NO DICHO') || t.includes('NO TENGO') || t.includes('NO LOS TENGO')) return 'weak';
  return 'claim';
}

/* --------------------------------------------------------------- helpers */

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

const lines = (arr) => (arr || []).join('\n');
const toLines = (text) => String(text || '').split('\n').map((s) => s.trim()).filter(Boolean);
const nl2br = (text) => esc(text).replace(/\n/g, '<br/>');

function initials(text) {
  return String(text || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ------------------------------------------------------------ cabecera */

function renderClock() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#clock').textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

function renderStats() {
  const counts = {};
  for (const o of state.offers) counts[o.estado] = (counts[o.estado] || 0) + 1;
  const cells = [{ label: 'Total', value: state.offers.length, c: null }]
    .concat(ESTADOS.filter((e) => counts[e.id]).map((e) => ({ label: e.label, value: counts[e.id], c: variantVar(e.variant) })));

  $('#stats').innerHTML = cells
    .map((c) => `<div class="stat"><b>${c.value}</b><span class="stat-label">${esc(c.label)}</span></div>`)
    .join('');
}

/* ---------------------------------------------------------------- lista */

function renderFilters() {
  const opts = [{ id: 'todas', label: 'Todas', variant: null }].concat(ESTADOS);
  $('#filters').innerHTML = opts
    .map((o) => `<button class="filter-chip" data-estado="${esc(o.id)}" style="--chip-c:${o.variant ? esc(variantVar(o.variant)) : 'var(--accent)'}"
        aria-pressed="${o.id === filterEstado}">${esc(o.label)}</button>`)
    .join('');
}

function renderGrid() {
  const q = query.trim().toLowerCase();
  const visible = state.offers.filter((o) => {
    if (filterEstado !== 'todas' && o.estado !== filterEstado) return false;
    if (!q) return true;
    const haystack = [o.titulo, o.empresa, o.descripcion, o.modalidad, (o.tecnologias || []).join(' ')]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  const tiles = visible.map((o) => {
    const est = estadoInfo(o.estado);
    const { b1, b2 } = brandPair(o);
    return `
      <div class="tile-figure">
        <button class="tile" data-id="${esc(o.id)}" style="--b1:${esc(b1)};--b2:${esc(b2)}">
          <span class="tile__inner"><span class="tile__mark">${esc(initials(o.empresa))}</span></span>
          <span class="badge badge--${esc(est.variant)}">${esc(est.label)}</span>
        </button>
        <span class="tile-caption">
          <span class="tile-caption__title">${esc(o.titulo)}</span>
          <span class="tile-caption__meta">${esc(o.empresa)}</span>
        </span>
      </div>`;
  });

  tiles.push(`
      <div class="tile-figure">
        <button class="card-add" id="card-add" title="Nueva oferta">+</button>
        <span class="tile-caption">
          <span class="tile-caption__title">Nueva oferta</span>
        </span>
      </div>`);
  $('#grid').innerHTML = tiles.join('');
  $('#empty').hidden = visible.length > 0;
}

function renderList() {
  renderStats();
  renderFilters();
  renderGrid();
}

/* -------------------------------------------------------------- detalle */

/* Panel colapsable (details/summary nativo, sin JS extra). */
function panel(title, bodyHtml, open = true) {
  return `<details class="panel"${open ? ' open' : ''}>
    <summary class="panel-title">${esc(title)}</summary>
    <div class="panel-body">${bodyHtml}</div>
  </details>`;
}

/* Panel fijo, sin colapsar (para los datos siempre visibles del lateral). */
function panelStatic(title, bodyHtml) {
  return `<div class="panel">
    <h3 class="panel-title panel-title--static">${esc(title)}</h3>
    <div class="panel-body">${bodyHtml}</div>
  </div>`;
}

function sectionView(title, items) {
  if (!items || !items.length) return '';
  return panel(title, `<ul class="bullets">${items.map((i) => `<li>${nl2br(i)}</li>`).join('')}</ul>`);
}

function sectionNotes(title, items) {
  if (!items || !items.length) return '';
  return panel(title, items.map((i) => `<div class="note note--${noteVariant(i)}">${nl2br(i)}</div>`).join(''));
}

function sectionEdit(title, name, items, hint) {
  return panel(title, `<div class="field">
        <textarea class="textarea" name="${esc(name)}" rows="6">${esc(lines(items))}</textarea>
        <p class="hint">${esc(hint || 'Una línea por punto.')}</p>
      </div>`);
}

function renderDetail() {
  const o = getOffer(detailId);
  if (!o) return showList();

  const est = estadoInfo(o.estado);
  const cv = o.cv || {};
  const carta = o.carta || {};
  const { b1, b2 } = brandPair(o);

  const hero = `<div class="hero" style="--b1:${esc(b1)};--b2:${esc(b2)}"><span class="hero__title">${esc(o.titulo)}</span></div>`;

  const head = `
    <div class="detail-top">
      <div class="sub">${esc(o.empresa)}${o.modalidad ? ' · ' + esc(o.modalidad) : ''} <span class="badge badge--${esc(est.variant)}">${esc(est.label)}</span></div>
      <div class="detail-actions">
        <button class="btn btn--ghost btn-icon" data-action="back" aria-label="Volver a la lista" title="Volver a la lista"><span class="icon-chevron-left"></span></button>
        ${detailMode === 'view'
          ? '<button class="btn btn--primary" data-action="edit">Editar</button>'
          : '<button class="btn btn--primary" data-action="save">Guardar</button><button class="btn btn--danger" data-action="cancel">Cancelar</button>'}
        <button class="btn btn--danger" data-action="delete">Borrar</button>
      </div>
    </div>`;

  const body = detailMode === 'view' ? detailViewBody(o, est, cv, carta) : detailEditBody(o, cv, carta);
  $('#view-detail').innerHTML = hero + head + body;
}

function detailViewBody(o, est, cv, carta) {
  const sideMeta = [
    ['Modalidad', o.modalidad],
    ['Ubicación', o.ubicacion],
    ['Fecha de envío', o.fechaEnvio],
  ].filter(([, v]) => v);

  const datosBody = `
    ${sideMeta.map(([k, v]) => `<div class="kv"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('')}
    ${o.url ? `<div class="field"><a class="cv-link" href="${esc(o.url)}" target="_blank" rel="noopener">Ver oferta original</a></div>` : ''}`;

  const sidePanel = panelStatic('Datos', datosBody)
    + (cv.ruta || cv.fuente
      ? panelStatic('CV enviado', `
          ${cv.ruta ? `<div class="field"><a class="cv-link" href="${esc(cv.ruta)}" target="_blank" rel="noopener">PDF · ${esc(cv.nombre || cv.ruta)}</a></div>` : ''}
          ${cv.fuente ? `<div class="field"><a class="cv-link" href="${esc(cv.fuente)}" target="_blank" rel="noopener">Fuente HTML</a></div>` : ''}
          ${cv.idioma ? `<p class="hint">Idioma: ${esc(cv.idioma)}</p>` : ''}`)
      : '')
    + (carta.texto
      ? panelStatic('Carta de presentación', `
          <span class="badge badge--${carta.enviada ? 'offer' : 'draft'}">${carta.enviada ? 'Enviada' : 'No enviada'}</span>
          <p style="margin-top:var(--s3)">${nl2br(carta.texto)}</p>`)
      : '');

  const mainPanel = (o.descripcion ? panel('Descripción', `<p>${nl2br(o.descripcion)}</p>`) : '')
    + ((o.tecnologias || []).length
      ? panel('Tecnologías de la oferta', `<div class="taglist">${o.tecnologias.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>`)
      : '')
    + sectionNotes('A tener en cuenta en la entrevista', o.puntosEntrevista)
    + sectionView('Cómo adapté el CV', o.adaptacionCV)
    + sectionView('Cómo adapté la carta / presentación', o.adaptacionCarta)
    + sectionNotes('Lo que he dicho sobre mi experiencia', o.claimsExperiencia)
    + (o.notas ? panel('Notas', `<p>${nl2br(o.notas)}</p>`) : '');

  return `<div class="detail">
      <div class="detail-main">${mainPanel}</div>
      <div class="detail-side">${sidePanel}</div>
    </div>`;
}

function detailEditBody(o, cv, carta) {
  const estadoOpts = ESTADOS.map(
    (e) => `<option value="${esc(e.id)}"${e.id === o.estado ? ' selected' : ''}>${esc(e.label)}</option>`
  ).join('');
  const colorOpts = PALETTE.map(
    (c) => `<option value="${esc(c)}"${c === o.color ? ' selected' : ''}>${esc(c)}</option>`
  ).join('');

  const datosBody = `
      <div class="row">
        <div class="field"><label>Puesto</label><input class="input" type="text" name="titulo" value="${esc(o.titulo)}" required /></div>
        <div class="field"><label>Empresa</label><input class="input" type="text" name="empresa" value="${esc(o.empresa)}" /></div>
        <div class="field"><label>Estado</label><select class="select" name="estado">${estadoOpts}</select></div>
        <div class="field"><label>Modalidad</label><input class="input" type="text" name="modalidad" value="${esc(o.modalidad)}" /></div>
        <div class="field"><label>Ubicación</label><input class="input" type="text" name="ubicacion" value="${esc(o.ubicacion)}" /></div>
        <div class="field"><label>Fecha de envío</label><input class="input" type="date" name="fechaEnvio" value="${esc(o.fechaEnvio)}" /></div>
        <div class="field"><label>URL de la oferta</label><input class="input" type="url" name="url" value="${esc(o.url)}" /></div>
        <div class="field"><label>Color de la carta</label><select class="select" name="color">${colorOpts}</select></div>
      </div>`;

  const cvBody = `
      <div class="row">
        <div class="field"><label>Nombre del archivo</label><input class="input" type="text" name="cvNombre" value="${esc(cv.nombre)}" /></div>
        <div class="field"><label>Ruta del PDF</label><input class="input" type="text" name="cvRuta" value="${esc(cv.ruta)}" /></div>
        <div class="field"><label>Fuente HTML</label><input class="input" type="text" name="cvFuente" value="${esc(cv.fuente)}" /></div>
        <div class="field"><label>Idioma</label><input class="input" type="text" name="cvIdioma" value="${esc(cv.idioma)}" /></div>
      </div>`;

  const cartaBody = `
      <div class="field">
        <label class="checkbox-field"><input type="checkbox" name="cartaEnviada"${carta.enviada ? ' checked' : ''} /> Enviada</label>
      </div>
      <div class="field"><textarea class="textarea" name="cartaTexto" rows="7">${esc(carta.texto)}</textarea></div>`;

  return `<form id="detail-form">
    ${panelStatic('Datos', datosBody)}
    ${panel('Descripción', `<div class="field"><textarea class="textarea" name="descripcion" rows="6">${esc(o.descripcion)}</textarea></div>`)}
    ${panelStatic('CV enviado', cvBody)}
    ${panelStatic('Carta de presentación', cartaBody)}
    ${panel('Tecnologías de la oferta', `<div class="field"><textarea class="textarea" name="tecnologias" rows="5">${esc(lines(o.tecnologias))}</textarea>
      <p class="hint">Una tecnología por línea.</p></div>`)}

    ${sectionEdit('A tener en cuenta en la entrevista', 'puntosEntrevista', o.puntosEntrevista)}
    ${sectionEdit('Cómo adapté el CV', 'adaptacionCV', o.adaptacionCV)}
    ${sectionEdit('Cómo adapté la carta / presentación', 'adaptacionCarta', o.adaptacionCarta)}
    ${sectionEdit('Lo que he dicho sobre mi experiencia', 'claimsExperiencia', o.claimsExperiencia, 'Una línea por afirmación. Útil para no contradecirte en la entrevista.')}

    ${panel('Notas', `<div class="field"><textarea class="textarea" name="notas" rows="3">${esc(o.notas)}</textarea></div>`)}

    <div class="save-bar">
      <button type="button" class="btn btn--danger" data-action="cancel">Cancelar</button>
      <button type="submit" class="btn btn--primary">Guardar cambios</button>
    </div>
  </form>`;
}

function applyForm(o, form) {
  const f = new FormData(form);
  const get = (k) => String(f.get(k) || '').trim();

  o.titulo = get('titulo') || 'Sin título';
  o.empresa = get('empresa');
  o.estado = get('estado');
  o.modalidad = get('modalidad');
  o.ubicacion = get('ubicacion');
  o.fechaEnvio = get('fechaEnvio');
  o.url = get('url');
  o.color = get('color') || PALETTE[0];
  o.descripcion = get('descripcion');
  o.cv = { nombre: get('cvNombre'), ruta: get('cvRuta'), fuente: get('cvFuente'), idioma: get('cvIdioma') };
  o.carta = { enviada: f.get('cartaEnviada') === 'on', texto: get('cartaTexto') };
  o.tecnologias = toLines(f.get('tecnologias'));
  o.puntosEntrevista = toLines(f.get('puntosEntrevista'));
  o.adaptacionCV = toLines(f.get('adaptacionCV'));
  o.adaptacionCarta = toLines(f.get('adaptacionCarta'));
  o.claimsExperiencia = toLines(f.get('claimsExperiencia'));
  o.notas = get('notas');
}

/* ------------------------------------------------------------ navegación */

function showList() {
  detailId = null;
  document.body.classList.remove('is-detail');
  $('#view-detail').hidden = true;
  $('#view-list').hidden = false;
  renderList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDetail(id, mode = 'view') {
  detailId = id;
  detailMode = mode;
  document.body.classList.add('is-detail');
  $('#view-list').hidden = true;
  $('#view-detail').hidden = false;
  renderDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function newOffer() {
  const offer = {
    id: 'oferta-' + Date.now().toString(36),
    titulo: 'Nueva oferta',
    empresa: '',
    modalidad: '',
    ubicacion: '',
    fechaEnvio: new Date().toISOString().slice(0, 10),
    estado: 'preparando',
    color: PALETTE[state.offers.length % PALETTE.length],
    url: '',
    descripcion: '',
    cv: { nombre: '', ruta: '', fuente: '', idioma: '' },
    carta: { enviada: false, texto: '' },
    tecnologias: [],
    puntosEntrevista: [],
    adaptacionCV: [],
    adaptacionCarta: [],
    claimsExperiencia: [],
    notas: '',
  };
  state.offers.unshift(offer);
  saveState();
  showDetail(offer.id, 'edit');
}

/* ------------------------------------------------------------- eventos */

$('#filters').addEventListener('click', (ev) => {
  const chip = ev.target.closest('.filter-chip');
  if (!chip) return;
  filterEstado = chip.dataset.estado;
  renderList();
});

$('#grid').addEventListener('click', (ev) => {
  if (ev.target.closest('#card-add')) return newOffer();
  const card = ev.target.closest('.tile');
  if (card) showDetail(card.dataset.id);
});

$('#search').addEventListener('input', (ev) => {
  query = ev.target.value;
  renderGrid();
});

$('#btn-new').addEventListener('click', newOffer);

$('#view-detail').addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'back') return showList();
  if (action === 'edit') return showDetail(detailId, 'edit');
  if (action === 'cancel') return showDetail(detailId, 'view');
  if (action === 'save') return $('#detail-form').requestSubmit();
  if (action === 'delete') {
    const o = getOffer(detailId);
    if (!confirm(`¿Borrar "${o.titulo}"? No se puede deshacer.`)) return;
    state.offers = state.offers.filter((x) => x.id !== detailId);
    saveState();
    toast('Oferta borrada');
    showList();
  }
});

$('#view-detail').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const o = getOffer(detailId);
  if (!o) return;
  applyForm(o, ev.target);
  saveState();
  toast('Guardado');
  showDetail(detailId, 'view');
});

$('#btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ofertas.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('#btn-import').addEventListener('click', () => $('#file-import').click());

$('#file-import').addEventListener('change', async (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.offers)) throw new Error('Formato no válido');
    state = data;
    saveState();
    showList();
    toast('Importado');
  } catch (e) {
    alert('No se pudo importar el archivo: ' + e.message);
  }
  ev.target.value = '';
});

$('#btn-reset').addEventListener('click', () => {
  if (!confirm('Se descartarán tus cambios y se volverá a los datos de ejemplo. ¿Seguir?')) return;
  state = { offers: JSON.parse(JSON.stringify(DEFAULT_OFFERS)) };
  saveState();
  showList();
  toast('Datos restaurados');
});

$('#btn-theme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
  if (detailId) renderDetail();
  else renderGrid();
});

applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
renderClock();
showList();
