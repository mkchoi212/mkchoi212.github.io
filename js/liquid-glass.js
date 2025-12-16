// Simplified Liquid Glass Effect
// Based on https://github.com/shuding/liquid-glass (875 stars)
// Adapted for static circular buttons

(function() {
  'use strict';

  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function circleSDF(x, y, radius) {
    return length(x, y) - radius;
  }

  function createLiquidGlassFilter(element, options = {}) {
    const size = options.size || 44;
    const id = 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
    const scale = options.scale || 25;

    // Create canvas for displacement map
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    // Generate displacement map using circle SDF
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const uvX = (x / size) * 2 - 1;
        const uvY = (y / size) * 2 - 1;

        const dist = circleSDF(uvX, uvY, 0.85);
        const edge = smoothStep(0.15, -0.1, dist);

        // Calculate displacement based on distance from center
        const angle = Math.atan2(uvY, uvX);
        const strength = edge * smoothStep(0.0, -0.3, dist);

        let dx = Math.cos(angle) * strength * 0.5;
        let dy = Math.sin(angle) * strength * 0.5;

        // Add subtle refraction at edges
        const edgeRefract = smoothStep(-0.05, 0.1, dist) * smoothStep(0.2, 0.05, dist);
        dx += Math.cos(angle) * edgeRefract * 0.3;
        dy += Math.sin(angle) * edgeRefract * 0.3;

        const i = (y * size + x) * 4;
        data[i] = Math.floor((dx + 0.5) * 255);     // R - X displacement
        data[i + 1] = Math.floor((dy + 0.5) * 255); // G - Y displacement
        data[i + 2] = 128;                           // B - unused
        data[i + 3] = 255;                           // A - full opacity
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL();

    // Create SVG filter
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
      <defs>
        <filter id="${id}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"
                x="0" y="0" width="${size}" height="${size}">
          <feImage href="${dataURL}" width="${size}" height="${size}" result="dispMap"/>
          <feDisplacementMap in="SourceGraphic" in2="dispMap"
                             xChannelSelector="R" yChannelSelector="G" scale="${scale}"/>
        </filter>
      </defs>
    `;

    document.body.appendChild(svg);

    // Apply filter to element
    element.style.backdropFilter = `url(#${id}) blur(1px) contrast(1.15) brightness(1.05) saturate(1.2)`;
    element.style.webkitBackdropFilter = `url(#${id}) blur(1px) contrast(1.15) brightness(1.05) saturate(1.2)`;

    return { id, svg };
  }

  // Initialize liquid glass on back buttons
  function init() {
    const backBtns = document.querySelectorAll('.liquid-glass-btn');
    backBtns.forEach(btn => {
      createLiquidGlassFilter(btn, { size: 44, scale: 20 });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual use
  window.createLiquidGlassFilter = createLiquidGlassFilter;
})();
