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

      // ✅ Reemplazamos el fallback por una simulación de éxito
      socket.onerror = () => {
        console.warn("[Bypass] WebSocket falló, forzando ejecución manual");

        // Simula un bloque vacío o falso para Module._decryptAndRun
        const fakePayload = new Uint8Array([0]); // Puedes poner datos reales si tienes
        const ptr = Module._malloc(fakePayload.length);
        Module.HEAPU8.set(fakePayload, ptr);
        try {
          Module._decryptAndRun(ptr, fakePayload.length);
        } catch (e) {
          console.error("Error al ejecutar decryptAndRun forzado:", e);
        }
        Module._free(ptr);
      };
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
