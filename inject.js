if (typeof Module === "undefined") {
  const key = encodeURIComponent(window.__injectKey || "");

  var Module = {
    wasmBinary: new Uint8Array([]),
    onRuntimeInitialized() {
      const socket = new WebSocket(`wss://vanilla.agarbot.ovh/?key=${key}`);
      socket.binaryType = "arraybuffer";

      socket.onmessage = (event) => {
        const encrypted = new Uint8Array(event.data);
        const ptr = Module._malloc(encrypted.length);
        Module.HEAPU8.set(encrypted, ptr);
        Module._decryptAndRun(ptr, encrypted.length);
        Module._free(ptr);
      };

      const fallbackToAgarioCore = () => {
        console.warn("WebSocket failed. Attempting to load agario.core.js fallback...");

        // Neutraliser les symboles globaux Emscripten (attention : partiel)
        try {
          delete window.Module;
          delete window.ExitStatus;
          delete window.FS;
          delete window.ENVSUBST; // au cas oÃ¹ d'autres apparaissent
        } catch (e) {
          console.warn("Failed to clean up Emscripten globals:", e);
        }

        const fallbackScript = document.createElement("script");
        fallbackScript.src = "https://agar.io/agario.core.js?v=" + Date.now();
        document.body.appendChild(fallbackScript);
		
if (!document.getElementById('popup-animation-style')) {
  const style = document.createElement('style');
  style.id = 'popup-animation-style';
  style.textContent = `
    @keyframes popupFadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.85);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes popupFadeOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.85);
      }
    }

    #floating-scaled-popup {
      animation: popupFadeIn 0.3s ease-out forwards;
    }

    #floating-scaled-popup.fade-out {
      animation: popupFadeOut 0.25s ease-in forwards;
    }
  `;
  document.head.appendChild(style);
}

function showResponsiveScaledPopup(htmlContent) {
  const existing = document.getElementById('floating-scaled-popup');
  if (existing) existing.remove();

  const popupWrapper = document.createElement('div');
  popupWrapper.id = 'floating-scaled-popup';

  Object.assign(popupWrapper.style, {
    position: 'fixed',
    top: '30%',
    left: '50%',
    zIndex: '99999',
    pointerEvents: 'auto',
  });
	const overlay = document.createElement('div');
	overlay.id = 'popup-overlay-blocker';
	Object.assign(overlay.style, {
	  position: 'fixed',
	  top: 0,
	  left: 0,
	  width: '100vw',
	  height: '100vh',
	  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
	  zIndex: '99998',
	  pointerEvents: 'auto',
	});
	overlay.onclick = () => closePopup();
	document.body.appendChild(overlay);
  popupWrapper.innerHTML = `
    <div style="
      background: rgba(30,30,30,0.95);
      color: white;
      padding: 3vmin;
      border-radius: 2vmin;
      box-shadow: 0 0 3vmin rgba(0,0,0,0.7);
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 2.2vmin;
      width: auto;
      max-width: 65vmin;
      min-width: 30vmin;
      position: relative;
    ">
      <div style="
        background: #3366ff;
        color: white;
        font-size: 2.2vmin;
        font-weight: bold;
        padding: 1.8vmin 2vmin;
        border-top-left-radius: 1.5vmin;
        border-top-right-radius: 1.5vmin;
        margin: -3vmin -3vmin 2vmin -3vmin;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span>Agarbot.ovh</span>
        <button id="popup-close-btn-top" style="
          background: transparent;
          border: none;
          color: white;
          font-size: 2.5vmin;
          font-weight: bold;
          cursor: pointer;
          line-height: 1;
        ">&times;</button>
      </div>

      ${htmlContent}

      <br>
      <button id="popup-close-btn-bottom" style="
        padding: 1.2vmin 3vmin;
        border: none;
        border-radius: 1vmin;
        background: #3366ff;
        color: white;
        font-weight: bold;
        font-size: 2vmin;
        cursor: pointer;
      ">Close</button>
    </div>
  `;
  document.body.appendChild(popupWrapper);
  let observer = null;
  function closePopup() {
	window.removeEventListener('resize', applyScaleFromApp);
	document.getElementById('popup-overlay-blocker')?.remove();
    popupWrapper.classList.add('fade-out');
    if (observer) observer.disconnect();
    setTimeout(() => popupWrapper.remove(), 250);
  }
  popupWrapper.querySelector('#popup-close-btn-top')?.addEventListener('click', closePopup);
  popupWrapper.querySelector('#popup-close-btn-bottom')?.addEventListener('click', closePopup);
  function applyScaleFromApp() {
    const app = document.getElementById('mainui-app');
    if (!app) {
		return;
	}
	const transform = getComputedStyle(app).transform;
	let scaleValue = '1';
	if (transform.includes('scale')) {
	  const match = transform.match(/scale\(([^)]+)\)/);
	  scaleValue = match ? match[1] : '1';
	} else if (transform.includes('matrix')) {
	  const match = transform.match(/matrix\(([^,]+),/);
	  scaleValue = match ? match[1] : '1';
	}
    popupWrapper.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
  }

  applyScaleFromApp();
  window.addEventListener('resize', applyScaleFromApp);
  const app = document.getElementById('mainui-app');
  if (app) {
    observer = new MutationObserver(applyScaleFromApp);
    observer.observe(app, { attributes: true, attributeFilter: ['style'] });
  }
}
showResponsiveScaledPopup(`
  <h2 style="font-size:2.5vmin; margin-bottom:1.5vmin;">Vanilla support is dropped</h2>
  <p>
    Please use <a href="https://deltav4.glitch.me/" target="_blank" style="color: #ffcc00; font-weight: bold;">delta</a> extension
  </p>
  <div style="margin: 1.5vmin 0; font-size: 1.8vmin; opacity: 0.7;">or</div>
  <p>
    <a href="https://agarbot.ovh/specialplans.php" target="_blank" style="color:#ff4444; font-weight: bold;">Buy a plan</a>
  </p>
`);		
		
		
		
		
		
      };

      socket.onerror = fallbackToAgarioCore;
    }
  };

  fetch("https://extbackup.agarbot.ovh/ogario/d/main.wasm")
    .then(res => res.arrayBuffer())
    .then(buffer => {
      Module.wasmBinary = new Uint8Array(buffer);
      const script = document.createElement("script");
      script.src = "https://extbackup.agarbot.ovh/ogario/d/main.js";
      document.body.appendChild(script);
    });
}
