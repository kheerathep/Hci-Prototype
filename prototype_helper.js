// Prototype Navigation Helper for Check Before Deal Mobile
const SCREEN_MAP = {
  S01: '../s01/code.html',
  S02: '../s02/code.html',
  S03: '../s03/code.html',
  S04: '../s04_min_sneaker_shop/code.html',
  S05: '../s05_pim_preloved/code.html',
  S06: '../s06_kitti_used_gear/code.html',
  S07: '../s07/code.html',
  S08: '../s08/code.html',
  S09: '../s09/code.html',
  S10: '../s10_4_6/code.html',
  S11: '../s11_6_6/code.html',
  S12: '../s12_proof_code_kt_4829/code.html',
  S13: '../s13_proof_code/code.html',
  S14: '../s14/code.html',
  S15: '../s15/code.html',
  S16: '../s16/code.html',
  S17: '../s17/code.html',
  S18: '../s18/code.html',
  S19: '../s19_10/code.html',
  S20: '../s20/code.html',
  S21: '../s21/code.html',
  S22: '../s22/code.html',
  S23: '../s23_1/code.html',
  S24: '../s24_2/code.html',
  S25: '../s25/code.html',
  S26: '../s26/code.html',
  S27: '../s27/code.html',
  S28: '../s28/code.html',
  S29: '../s29/code.html',
  S30: '../s30/code.html',
  S31: '../s31/code.html',
  S32: '../s32/code.html',
  S33: '../s33/code.html',
  S34: '../s34/code.html',
  S35: '../s35/code.html',
  S36: '../s36/code.html',
  S37: '../s37/code.html',
  S38: '../s38/code.html',
  S39: '../s39_notifications/code.html',
  S40: '../s40/code.html',
  S41: '../s41/code.html'
};

function protoGoto(screenId) {
  const target = SCREEN_MAP[screenId];
  if (!target) {
    console.warn('[Prototype] Unknown screen ID:', screenId);
    return;
  }
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PROTO_NAVIGATE', to: screenId }, '*');
    }
  } catch(e) {}
  window.location.href = target;
}

// Global hotkeys or helpers
window.protoGoto = protoGoto;

document.addEventListener('DOMContentLoaded', () => {
  // Bind all data-proto-goto elements
  document.querySelectorAll('[data-proto-goto]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = el.getAttribute('data-proto-goto');
      if (target) {
        protoGoto(target);
      }
    });
  });

  // Inject CSS for hotspots and clickable feedback
  const style = document.createElement('style');
  style.textContent = `
    [data-proto-goto] {
      cursor: pointer !important;
      -webkit-tap-highlight-color: rgba(37, 99, 235, 0.2);
    }
    body.show-proto-hotspots [data-proto-goto] {
      outline: 2px dashed #2563EB !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.45) !important;
      transition: all 0.2s ease-in-out !important;
    }
    body.show-proto-hotspots [data-proto-goto]:hover {
      outline: 2px solid #1D4ED8 !important;
      background-color: rgba(37, 99, 235, 0.08) !important;
    }
  `;
  document.head.appendChild(style);

  // Check if hotspots were enabled by parent frame
  try {
    if (window.parent && window.parent.PROTO_SHOW_HOTSPOTS) {
      document.body.classList.add('show-proto-hotspots');
    }
  } catch(e) {}

  // Message listener from parent frame
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'TOGGLE_HOTSPOTS') {
      document.body.classList.toggle('show-proto-hotspots', !!event.data.show);
    }
  });

  // Notify parent of current loaded screen
  try {
    const curPath = window.location.pathname;
    for (const [id, rel] of Object.entries(SCREEN_MAP)) {
      const folder = rel.replace('../', '').replace('/code.html', '');
      if (curPath.includes(folder)) {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'SCREEN_LOADED', screenId: id }, '*');
        }
        break;
      }
    }
  } catch(e) {}
});

