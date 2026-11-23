const ink = '#704950';
export const star = `<path d="m20 2 4.7 11.5L37 15l-9.5 8.3L30 36l-10-6.5L9 36l2.5-12.7L2 15l12.3-1.5Z"/>`;
export function sparkle(className = '') { return `<svg class="sparkle ${className}" viewBox="0 0 40 40" aria-hidden="true">${star}</svg>`; }
export function heart(className = '') { return `<svg class="drawn-heart ${className}" viewBox="0 0 70 65" aria-hidden="true"><path d="M35 57C29 53 3 35 5 20 7 2 30 1 35 17 43 0 65 4 65 21 65 35 43 52 35 57Z"/></svg>`; }

export function decoration() {
  return `<div class="decor" aria-hidden="true">
    <svg class="bunting" viewBox="0 0 1200 180" preserveAspectRatio="none"><path d="M-20 8Q600 235 1220 8" fill="none" stroke="${ink}" stroke-width="2.5"/>
    ${Array.from({ length: 13 }, (_, i) => { const x = i * 100; const y = 8 + 110 * (1 - ((x - 600) / 620) ** 2); return `<path d="m${x - 24} ${y - 7} 48 0-24 50Z" fill="${['#ed8275', '#b3b9db', '#f1c75f', '#9ebf9e'][i % 4]}" stroke="${ink}" stroke-width="2.5" transform="rotate(${(600 - x) / 50},${x},${y})"/>`; }).join('')}</svg>
    <svg class="balloons balloons-left" viewBox="0 0 180 370"><path d="M76 150q-23 55 4 95t-10 110M131 120q35 60 1 117t10 108" fill="none" stroke="${ink}" stroke-width="2"/><g class="balloon-one"><ellipse cx="66" cy="87" rx="46" ry="61" transform="rotate(-15 66 87)" fill="#ef958a" stroke="${ink}" stroke-width="3"/><path d="m77 146-8 12 17-2Z" fill="#ef958a" stroke="${ink}" stroke-width="2"/><path d="M38 62q-8 14-4 27" fill="none" stroke="#ffe9df" stroke-width="7" stroke-linecap="round"/></g><g class="balloon-two"><ellipse cx="132" cy="65" rx="35" ry="49" transform="rotate(12 132 65)" fill="#c5c6e5" stroke="${ink}" stroke-width="3"/><path d="m124 113-4 10 14-1Z" fill="#c5c6e5" stroke="${ink}" stroke-width="2"/><path d="M115 40q-8 10-6 23" fill="none" stroke="#f0efff" stroke-width="5" stroke-linecap="round"/></g></svg>
    <svg class="balloons balloons-right" viewBox="0 0 180 370"><path d="M76 150q-23 55 4 95t-10 110M131 120q35 60 1 117t10 108" fill="none" stroke="${ink}" stroke-width="2"/><ellipse cx="66" cy="87" rx="46" ry="61" transform="rotate(-15 66 87)" fill="#edc563" stroke="${ink}" stroke-width="3"/><path d="m77 146-8 12 17-2Z" fill="#edc563" stroke="${ink}" stroke-width="2"/><path d="M38 62q-8 14-4 27" fill="none" stroke="#fff1c9" stroke-width="7" stroke-linecap="round"/><ellipse cx="132" cy="65" rx="35" ry="49" transform="rotate(12 132 65)" fill="#a9c6ae" stroke="${ink}" stroke-width="3"/><path d="m124 113-4 10 14-1Z" fill="#a9c6ae" stroke="${ink}" stroke-width="2"/></svg>
    <div class="confetti-doodles">${Array.from({ length: 22 }, (_, i) => `<i style="--x:${(i * 43 + 7) % 100}%;--y:${(i * 31 + 14) % 100}%;--r:${i * 37}deg;--color:${['#e99588', '#b2badd', '#e6bd57', '#9eb8a2'][i % 4]}"></i>`).join('')}</div>
  </div>`;
}

export function giftArt(index: number) {
  const colors = ['#ee9388', '#b7b8db', '#edc566', '#9dbfa9', '#e7a5bd', '#9dbdcd'];
  const ribbon = ['#ffe6bd', '#fff1cd', '#e98e80', '#fff0c7', '#b8caaf', '#f3c5a2'][index];
  const patterns = Array.from({ length: 9 }, (_, i) => index % 2 === 0
    ? `<circle cx="${43 + (i % 3) * 38}" cy="${104 + Math.floor(i / 3) * 23}" r="3.5" fill="#fff5dc" opacity=".65"/>`
    : `<path d="m${38 + (i % 3) * 40} ${102 + Math.floor(i / 3) * 24} 11 7" stroke="#fff5dc" stroke-width="3" opacity=".65"/>`).join('');
  return `<svg class="gift-art" viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="181" rx="67" ry="7" fill="${ink}" opacity=".09"/><g class="gift-box"><path d="m33 82 134 2-4 89q-62 7-127-1Z" fill="${colors[index]}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>${patterns}<path d="m88 84 24 0-1 91-23-1Z" fill="${ribbon}" stroke="${ink}" stroke-width="2.5"/></g><g class="gift-lid"><path d="M96 65C42 75 43 19 66 30q16 4 30 35Zm8 0c55 9 52-47 29-35q-16 5-29 35Z" fill="${ribbon}" stroke="${ink}" stroke-width="3"/><path d="M87 65q12-12 26 0l-2 12-24-1Z" fill="${ribbon}" stroke="${ink}" stroke-width="3"/><path d="m27 69 147 2-1 23-145-2Z" fill="${colors[index]}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="m87 70 26 0-1 23-25-1Z" fill="${ribbon}" stroke="${ink}" stroke-width="2.5"/></g></svg>`;
}

export function cakeArt() {
  return `<svg class="cake-art" viewBox="0 0 340 280" aria-hidden="true"><ellipse cx="170" cy="247" rx="127" ry="13" fill="#704950" opacity=".09"/><path d="M45 238q120 24 250 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="m67 153 205 0-3 82q-98 24-199 0Z" fill="#efacaa" stroke="${ink}" stroke-width="3"/><path d="M68 191q16 14 33 0t34 0 34 0 34 0 34 0 34 0" fill="none" stroke="#fff1d8" stroke-width="8"/><path d="M65 153c-3-26 212-27 210 0l-3 25q-14 19-23-1c-8-15-17-9-20 6-3 20-24 18-28-1-3-15-18-15-22 1-5 19-24 18-28 0-3-15-18-20-23-2-6 19-23 14-25-1-3-17-18-17-22-1-4 11-14 7-15-1Z" fill="#fff8e9" stroke="${ink}" stroke-width="3"/><path d="M65 153q102 25 210 0" fill="none" stroke="${ink}" stroke-width="2"/>
    ${[115, 170, 225].map((x, i) => `<path d="m${x - 6} 131 0-49 12 0 0 49" fill="${['#a9c6ae', '#c5c6e5', '#edc563'][i]}" stroke="${ink}" stroke-width="2.5"/><path d="m${x - 5} 94 10 5m-10 8 10 5" stroke="#fff8e9" stroke-width="3"/><path class="flame flame-${i}" d="M${x} 76q-15-9 0-27 15 17 0 27Z" fill="#edbf58" stroke="${ink}" stroke-width="2"/>`).join('')}
    <path d="m36 87 7-13m-18 2 10 3m255 28 12-7m-6 17 10 4" stroke="#bc8c83" stroke-width="3" stroke-linecap="round"/><path d="m53 34 4 10 11 1-8 7 2 10-9-5-9 5 2-10-8-7 11-1Z" fill="#edc563" stroke="${ink}" stroke-width="2"/><path d="M281 55c-15-20-31 4 0 21 30-17 15-41 0-21Z" fill="#ef958a" stroke="${ink}" stroke-width="2"/></svg>`;
}

export function wishIcon(index: number) {
  const paths = [
    '<path d="M30 49C3 32 7 12 21 14q7 0 9 9c9-21 35-1 0 26Z"/>',
    '<circle cx="30" cy="30" r="21"/><path d="M38 20H25a6 6 0 0 0 0 12h10a6 6 0 0 1 0 12H21m9-30v36" fill="none"/>',
    '<circle cx="30" cy="30" r="21"/><path d="M20 35q10 13 20 0M21 23v3m18-3v3" fill="none"/>',
    '<path d="M30 49C3 32 7 12 21 14q7 0 9 9c9-21 35-1 0 26Z"/><path d="m39 11 2-7m6 12 7-3" fill="none"/>',
    '<path d="M30 28C9-5-5 31 27 31 1 45 29 67 31 34c12 31 39 6 4-4 34-4 10-32-5-2Z"/><path d="m29 32-8 23" fill="none"/>',
    '<circle cx="30" cy="30" r="22"/><path d="m39 20-6 17-13 4 6-17Z"/><path d="M30 3v5m0 44v5M3 30h5m44 0h5" fill="none"/>',
  ];
  return `<svg viewBox="0 0 60 60" class="wish-icon" aria-hidden="true" fill="none" stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${paths[index]}</svg>`;
}
