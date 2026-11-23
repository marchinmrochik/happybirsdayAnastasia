import '@fontsource/nunito/cyrillic-400.css';
import '@fontsource/nunito/cyrillic-600.css';
import '@fontsource/nunito/cyrillic-700.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/caveat/cyrillic-600.css';
import '@fontsource/caveat/latin-600.css';
import './style.css';
import { cakeArt, decoration, giftArt, heart, sparkle, wishIcon } from './art';
import { burst, stopConfetti } from './confetti';
import { paragraphs } from './letter';
import { loadLottery, saveLottery, wishes } from './state';

type Screen = 'cover' | 'lottery' | 'letter' | 'video' | 'final';
const app = document.querySelector<HTMLDivElement>('#app')!;
const lottery = loadLottery();
let persistent = saveLottery(lottery);
let screen: Screen = 'cover';
let revealing = false;
let revealTimer: ReturnType<typeof setTimeout> | undefined;
const base = import.meta.env.BASE_URL;

const stepNames = ['Праздник', 'Подарки', 'Письмо', 'Видео'];
function header(step: number) {
  return `<header class="site-header"><button class="wordmark" data-go="cover" aria-label="Вернуться на первый экран">для Насти<span>с любовью</span></button><nav class="steps" aria-label="Этапы поздравления">${stepNames.map((name, i) => `<span class="step ${i === step ? 'current' : ''} ${i < step ? 'completed' : ''}" ${i === step ? 'aria-current="step"' : ''}><span class="step-dot"></span><span class="step-label">${name}</span></span>`).join('')}</nav></header>`;
}
function footer() { return `<footer class="site-footer">маленький праздник для большого сердца ${heart()}</footer>`; }
function back(to: Screen, label = 'Назад') { return `<button class="text-button back-button" data-go="${to}"><span aria-hidden="true">‹</span> ${label}</button>`; }
function go(to: Screen, focus = true) {
  if ((to === 'letter' || to === 'video' || to === 'final') && lottery.opened.length !== 3) to = 'lottery';
  app.querySelector('video')?.pause();
  clearTimeout(revealTimer); revealing = false; stopConfetti();
  screen = to;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) app.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

function gift(index: number) {
  const opened = lottery.opened.includes(index);
  const wish = lottery.order[index];
  if (opened) return `<div class="gift revealed" data-gift="${index}" role="group" aria-label="Подарок ${index + 1}: ${wishes[wish]}"><div class="wish-paper"><span class="paper-pin"></span>${wishIcon(wish)}<span class="wish-prefix">Пусть будет больше</span><strong>${wishes[wish]}</strong><span class="wish-sign">тебе, с любовью</span></div></div>`;
  return `<button class="gift closed gift-${index}" data-gift="${index}" aria-label="Открыть подарок ${index + 1}" ${lottery.opened.length === 3 ? 'disabled' : ''}>${giftArt(index)}<span class="gift-tap">открыть</span></button>`;
}

function render() {
  document.body.dataset.screen = screen;
  if (screen === 'cover') {
    app.innerHTML = `${decoration()}${header(0)}<main class="cover screen"><p class="eyebrow">сегодня всё — для тебя</p><button class="cover-open" id="start"><span class="visually-hidden">Начать поздравление. </span><span class="hero-art">${sparkle('hero-star')}${cakeArt()}${sparkle('hero-star-small')}</span><h1 tabindex="-1">В честь<br><em>твоего дня</em></h1><span class="cover-caption">Немного волшебства. И много любви.</span><span class="start-label">Нажми один раз <span class="tap-star" aria-hidden="true">✦</span></span></button><p class="handwritten cover-note">Настя, этот маленький праздник — твой!</p></main>${footer()}`;
    app.querySelector('#start')!.addEventListener('click', () => { go('lottery'); burst(); });
  } else if (screen === 'lottery') {
    app.innerHTML = `${decoration()}${header(1)}<main class="lottery screen"><div class="section-heading"><p class="eyebrow">немного праздничной магии</p><h1 tabindex="-1">Лотерея <em>на пожелания</em></h1><p class="subtitle">Выбери 3 подарка. В каждом — что-то хорошее.</p><div class="selection-status"><span class="tiny-stars" aria-hidden="true">✧</span><span id="counter" role="status">Открыто ${lottery.opened.length} из 3</span><span class="tiny-stars" aria-hidden="true">✧</span></div></div><div class="gifts-grid" aria-label="Шесть подарков">${Array.from({ length: 6 }, (_, i) => gift(i)).join('')}</div><div class="lottery-bottom"><p id="lottery-hint" class="handwritten">${lottery.opened.length === 3 ? 'Пусть всё это обязательно сбудется!' : 'У каждого подарка — свой маленький секрет'}</p><button class="next-button" id="lottery-next" ${lottery.opened.length < 3 ? 'hidden' : ''} data-go="letter">Перейти далее <span aria-hidden="true">✦</span></button><p class="storage-note" ${persistent ? 'hidden' : ''}>Браузер не разрешил сохранить выбор. Он останется открытым, пока открыта эта страница.</p></div>${back('cover', 'На первый экран')}<p class="visually-hidden" id="reveal-status" role="status"></p></main>${footer()}`;
    app.querySelectorAll<HTMLButtonElement>('.gift.closed').forEach(button => button.addEventListener('click', () => openGift(button)));
  } else if (screen === 'letter') {
    app.innerHTML = `${decoration()}${header(2)}<main class="letter-screen screen"><div class="section-heading"><p class="eyebrow">есть кое-что важное</p><h1 tabindex="-1">Моей дорогой <em>подруге</em></h1><p class="subtitle">Слова, которые хочется сказать тебе.</p></div><article class="letter-paper"><span class="tape tape-left" aria-hidden="true"></span><span class="tape tape-right" aria-hidden="true"></span><div class="letter-salutation handwritten">Моя дорогая Настя,</div>${paragraphs.map((p, i) => `<p${i === paragraphs.length - 1 ? ' class="postscript"' : ''}>${p}</p>`).join('')}<div class="letter-signature handwritten">С любовью, твоя Настя ${heart()}</div></article><div class="letter-bottom"><p class="handwritten">И ещё один маленький сюрприз…</p><button class="next-button" data-go="video">Перейти далее <span aria-hidden="true">✦</span></button></div>${back('lottery', 'К подаркам')}</main>${footer()}`;
  } else if (screen === 'video') {
    app.innerHTML = `${header(3)}<main class="video-screen screen"><div class="section-heading"><p class="eyebrow">твой маленький киносеанс</p><h1 tabindex="-1">Ещё немного <em>волшебства</em></h1></div><div class="video-frame"><span class="tape tape-left" aria-hidden="true"></span><span class="tape tape-right" aria-hidden="true"></span><video id="birthday-video" playsinline controls preload="metadata" poster="${base}media/poster.jpg" aria-label="Видео с поздравлением для Насти"><source src="${base}media/birthday-video.mp4" type="video/mp4" /><p>Ваш браузер не поддерживает видео.</p></video><button class="video-play" id="video-play" aria-label="Включить поздравительное видео"><span aria-hidden="true">▶</span><span>Включить поздравление</span></button></div><p class="video-caption" id="video-caption" role="status">Нажми на видео. Этот момент — для тебя.</p><div id="video-error" class="video-error" hidden><p>Видео не удалось загрузить. Попробуй ещё раз или открой его отдельно.</p><button class="text-button" id="video-retry">Попробовать ещё раз</button><a href="${base}media/birthday-video.mp4">Открыть видео</a></div>${back('letter', 'К письму')}</main>${footer()}`;
    bindVideo();
  } else {
    app.innerHTML = `${decoration()}${header(3)}<main class="final-screen screen"><p class="eyebrow">загадай самое заветное</p><div class="final-art">${sparkle('final-star')}${cakeArt()}${heart('final-heart')}</div><h1 tabindex="-1">С днём<br><em>рождения!</em></h1><p class="final-name handwritten">Моя дорогая Настя</p><p class="final-message">Пусть всё хорошее, что ты даришь миру,<br class="desktop-break"> возвращается к тебе.</p><div class="final-actions"><button class="next-button" data-go="video">Посмотреть видео ещё раз</button><button class="text-button" data-go="letter">Перечитать письмо</button><button class="text-button" data-go="lottery">Мои пожелания</button></div></main>${footer()}`;
    burst(innerWidth / 2, innerHeight * .35);
  }
  app.querySelectorAll<HTMLButtonElement>('[data-go]').forEach(button => button.addEventListener('click', () => go(button.dataset.go as Screen)));
}

function openGift(button: HTMLButtonElement) {
  const index = Number(button.dataset.gift);
  if (revealing || lottery.opened.length >= 3 || lottery.opened.includes(index)) return;
  revealing = true;
  lottery.opened.push(index);
  persistent = saveLottery(lottery);
  app.querySelectorAll<HTMLButtonElement>('.gift.closed').forEach(b => { b.disabled = true; });
  button.classList.add('opening');
  const rect = button.getBoundingClientRect();
  burst(rect.x + rect.width / 2, rect.y + rect.height / 2);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealTimer = setTimeout(() => {
    if (screen !== 'lottery') return;
    const wasFocused = document.activeElement === button;
    const holder = document.createElement('div'); holder.innerHTML = gift(index);
    button.replaceWith(holder.firstElementChild!);
    app.querySelector('#counter')!.textContent = `Открыто ${lottery.opened.length} из 3`;
    app.querySelector('#reveal-status')!.textContent = `Твоё пожелание: ${wishes[lottery.order[index]]}. Открыто ${lottery.opened.length} из 3.`;
    const next = app.querySelector<HTMLButtonElement>('#lottery-next')!;
    if (lottery.opened.length === 3) {
      next.hidden = false;
      app.querySelector('#lottery-hint')!.textContent = 'Пусть всё это обязательно сбудется!';
      if (wasFocused) next.focus({ preventScroll: true });
    } else {
      app.querySelectorAll<HTMLButtonElement>('.gift.closed').forEach(b => { b.disabled = false; });
      if (wasFocused) app.querySelector<HTMLButtonElement>('.gift.closed')?.focus({ preventScroll: true });
    }
    if (!persistent) app.querySelector<HTMLElement>('.storage-note')!.hidden = false;
    revealing = false;
  }, reduced ? 0 : 650);
}

function bindVideo() {
  const video = app.querySelector<HTMLVideoElement>('video')!;
  const play = app.querySelector<HTMLButtonElement>('#video-play')!;
  const caption = app.querySelector('#video-caption')!;
  const error = app.querySelector<HTMLDivElement>('#video-error')!;
  play.addEventListener('click', async () => {
    try { await video.play(); }
    catch { caption.textContent = 'Нажми кнопку воспроизведения на самом видео.'; play.hidden = true; }
  });
  video.addEventListener('play', () => { play.hidden = true; caption.textContent = 'Этот момент — для тебя.'; });
  video.addEventListener('waiting', () => { caption.textContent = 'Загружаем немного волшебства…'; });
  video.addEventListener('playing', () => { caption.textContent = 'Этот момент — для тебя.'; });
  video.addEventListener('ended', () => {
    // Leave native fullscreen on phones before presenting the final page.
    const iosVideo = video as HTMLVideoElement & { webkitExitFullscreen?: () => void };
    try { iosVideo.webkitExitFullscreen?.(); } catch { /* Already inline. */ }
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    go('final');
  });
  const onError = () => { error.hidden = false; play.hidden = true; caption.textContent = ''; };
  video.addEventListener('error', onError);
  video.querySelector('source')!.addEventListener('error', onError);
  app.querySelector('#video-retry')!.addEventListener('click', () => {
    error.hidden = true; play.hidden = false; video.load(); caption.textContent = 'Нажми на видео. Этот момент — для тебя.';
  });
}

render();
