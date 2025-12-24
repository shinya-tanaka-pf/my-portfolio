function getWorkData(id) {
  if (!Array.isArray(worksData)) return null;
  return worksData.find(item => item.id === id);
}
function initScrollButton() {
  const sections = document.querySelectorAll('.section-top');
  const scrollBtn = document.querySelector('.nextpage');

  if (!scrollBtn || !sections.length) return;

  let currentIndex = 0;

  scrollBtn.addEventListener('click', () => {
    currentIndex++;

    if (currentIndex >= sections.length) {
      currentIndex = 0;
    }

    sections[currentIndex].scrollIntoView({ behavior: 'smooth' });

    scrollBtn.classList.toggle(
      'reverse',
      currentIndex === sections.length - 1
    );
  });
}
document.addEventListener('DOMContentLoaded', () => {

  const worksItem = document.querySelector('.has-submenu');
  const topMenu = document.querySelector('.top-menu');
  const submenu = worksItem.querySelector('.submenu');

  // ===== ダークモード関連 =====
  const changerLeft = document.querySelector('.changer-left');
  const changerRight = document.querySelector('.changer-right');
  const changerSc = document.querySelector('.changer-sc');

  // SPボタン
  const spWhiteBtn = document.querySelector('.go-white');
  const spBlackBtn = document.querySelector('.go-black');

  // PCボタン
  const pcWhiteBtn = document.querySelector('.go-white-pc');
  const pcBlackBtn = document.querySelector('.go-black-pc');

  // 画面幅判定
  const isPC = window.matchMedia('(min-width: 768px)');

  // --- 初期状態設定（PC/SPで異なる） ---
  function applyInitialMode() {
    if (isPC.matches) {
      // PC：左白・右黒
      changerLeft.classList.remove('dark');
      changerRight.classList.add('dark');
      changerSc.classList.add('dark');     
    } else {
      // SP：両方白
      changerLeft.classList.remove('dark');
      changerRight.classList.remove('dark');
      changerSc.classList.remove('dark');  
    }
  }

  // --- ボタンイベント登録（多重発火防止付き） ---
  function setButtonEvents() {
    // 既存イベント解除（念のため）
    spWhiteBtn?.replaceWith(spWhiteBtn.cloneNode(true));
    spBlackBtn?.replaceWith(spBlackBtn.cloneNode(true));
    pcWhiteBtn?.replaceWith(pcWhiteBtn.cloneNode(true));
    pcBlackBtn?.replaceWith(pcBlackBtn.cloneNode(true));

    // 再取得（上でcloneしたため）
    const newSpWhiteBtn = document.querySelector('.go-white');
    const newSpBlackBtn = document.querySelector('.go-black');
    const newPcWhiteBtn = document.querySelector('.go-white-pc');
    const newPcBlackBtn = document.querySelector('.go-black-pc');

    if (isPC.matches) {
      newPcBlackBtn?.addEventListener('click', () => {
        changerLeft.classList.add('dark');
        changerRight.classList.remove('dark');
        changerSc.classList.remove('dark');
        updateUnderline(); 
      });

      newPcWhiteBtn?.addEventListener('click', () => {
        changerLeft.classList.remove('dark');
        changerRight.classList.add('dark');
        changerSc.classList.add('dark');
        updateUnderline();  
      });

    } else {
      newSpWhiteBtn.addEventListener('click', () => {
        changerLeft.classList.remove('dark');
        changerRight.classList.remove('dark');
        changerSc.classList.remove('dark');
        updateUnderline(); 
      });

      newSpBlackBtn.addEventListener('click', () => {
        changerLeft.classList.add('dark');
        changerRight.classList.add('dark');
        changerSc.classList.add('dark');
        updateUnderline();  
      });
    }
  }

  // 初回実行
  applyInitialMode();
  setButtonEvents();

  // PC/SP切替時も反映
  isPC.addEventListener('change', () => {
    applyInitialMode();
    setButtonEvents();
  });
  // ===== 下線追加 =====
  function updateUnderline() {
    const spWhite = document.querySelector('.go-white');
    const spBlack = document.querySelector('.go-black');
    const pcWhite = document.querySelector('.go-white-pc');
    const pcBlack = document.querySelector('.go-black-pc');

    [spWhite, spBlack, pcWhite, pcBlack].forEach(el => el?.classList.remove('active'));

    // 現在のモードを判定
    const isDark = changerLeft.classList.contains('dark');

    if (window.matchMedia('(min-width: 768px)').matches) {
        // PC
        if (isDark) {
            pcBlack?.classList.add('active');
        } else {
            pcWhite?.classList.add('active');
        }
    } else {
        // SP
        if (isDark) {
            spBlack?.classList.add('active');
        } else {
            spWhite?.classList.add('active');
        }
    }
  }
// 初期表示
updateUnderline();
// ダークモードボタンに追加
spWhiteBtn?.addEventListener('click', updateUnderline);
spBlackBtn?.addEventListener('click', updateUnderline);
pcWhiteBtn?.addEventListener('click', updateUnderline);
pcBlackBtn?.addEventListener('click', updateUnderline);
// PC/SP切替時にも反映
window.matchMedia('(min-width: 768px)').addEventListener('change', updateUnderline);

  // ===== WORKsメニュー =====
  worksItem.addEventListener('click', (e) => {
    e.stopPropagation();
    worksItem.classList.toggle('open');

    if (worksItem.classList.contains('open')) {
      const submenuHeight = submenu.offsetHeight;
      topMenu.style.transform = `translateY(-${submenuHeight / 2}px)`;
    } else {
      topMenu.style.transform = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (
      e.target.closest('.go-white') ||
      e.target.closest('.go-black') ||
      e.target.closest('.go-white-pc') ||
      e.target.closest('.go-black-pc')
    ) return;

    if (worksItem.classList.contains('open')) {
      worksItem.classList.remove('open');
      topMenu.style.transform = '';
    }
  });
  //スクロールボタン

  initScrollButton();
  // フィルター機能
(function(){
  const toolbar = document.querySelector('.filters');
  const buttons = document.querySelectorAll('.filters button');
  const items = Array.from(document.querySelectorAll('.w-item'));
  const status = document.getElementById('filter-status');
  const grid = document.getElementById('w-grid'); // 追加


  function updateStatus(filter){
  const visibleCount = items.filter(i => !i.classList.contains('is-hidden')).length;
  const total = items.length;
  status.textContent = filter === 'all' ? `display:${visibleCount}` : `display:${filter}${visibleCount}`;
  }

  function applyFilter(filter) {
  items.forEach(it => {
    const cat = it.dataset.category;
    if(filter === 'all' || cat === filter){
      it.classList.remove('is-hidden');
      // 表示前に display を戻す
      it.classList.remove('display-none');
    } else {
      it.classList.add('is-hidden');
      // アニメーション後に display:none にする
      setTimeout(() => it.classList.add('display-none'), 350);
    }
  });
}
// submenu のクリック処理
document.querySelectorAll('.submenu a').forEach(a => {
    a.addEventListener('click', function(e){
        const filter = this.dataset.filter;
        
        // ハッシュ(#works) に飛ぶ挙動はそのまま活かすため preventDefaultしない
        // ただし、スクロール後にフィルタが動くように少し遅延させる
        setTimeout(() => {
            applyFilter(filter);
        }, 50);
    });
});
  
  // ボタン操作
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });

  // 初期表示
  applyFilter('all');
})();

/* dialogによるモーダル */

document.querySelectorAll('.w-item').forEach(item => {
  const id = item.dataset.workId;
  const data = getWorkData(id);

  console.log('workId:', id);
  console.log('workData:', data);

  if (!data) return;

  /* サムネ画像 */
  const img = item.querySelector('img[data-thumb-src]');
  if (img) {
    img.src = data.thumb;
    img.alt = data.title;
  }

  /* hoverタイトル */
  const titleEl = item.querySelector('[data-thumb-title]');
  if (titleEl) {
    titleEl.textContent = data.title;
  }
  
  /* category（念のため同期） */
  item.dataset.category = data.category;

    const dialog   = item.querySelector('.mydialog');
    const openBtn  = item.querySelector('.openButton');
    const closeBtn = item.querySelector('.closeButton');


/* ===== ユーティリティ ===== */
function linkify(text) {
  return text
    // [[URL]] だけをリンク化
    .replace(
      /\[\[(https?:\/\/[^\]]+)\]\]/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    )
    // 改行を <br> に変換
    .replace(/\n/g, '<br>');
}

/* ===== モーダル生成 ===== */
function buildModal(dialog, data) {
  dialog.querySelector('[data-modal-title]').textContent = data.title;

  const track = dialog.querySelector('[data-carousel-track]');
  track.innerHTML = '';

  data.media.forEach(media => {
    const item = document.createElement('div');
    item.className = 'carousel-item';

    if (media.type === 'image') {
      const img = document.createElement('img');
      img.src = media.src;
      if (media.class) img.className = media.class;
      item.appendChild(img);
    }

    if (media.type === 'video') {
      item.appendChild(createVideo(media));
    }

    track.appendChild(item);
  });

//worksdataの文章用
//\nで改行
//[[]]で囲めばリンク化
  let descHtml = data.description
    .replace(/\n/g, '<br>')
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

dialog.querySelector('[data-modal-texts]').innerHTML = `
  <div class="modal-text-child"><p>使用ツール：${data.tools}</p></div>
  <div class="modal-text-child"><p>制作期間：${data.period}</p></div>
  <div class="modal-text-child">
    <p>${linkify(data.description)}</p>
  </div>
`;

}

    /* ===== 動画リセット ===== */
    function resetVideo(slide){
      const video = slide.querySelector('video');
      const overlay = slide.querySelector('.video-overlay');
      const sound = slide.querySelector('.video-sound');

      if (!video) return;

      video.pause();
      video.currentTime = 0;
      video.muted = true;

      overlay?.classList.remove('hidden');
      if (sound) sound.textContent = 'unmute';
    }


function initCarousel(dialog) {
  const track = dialog.querySelector('[data-carousel-track]');
  const slides = dialog.querySelectorAll('.carousel-item');
  const indexText = dialog.querySelector('.carousel-index');
  const prev = dialog.querySelector('.prev');
  const next = dialog.querySelector('.next');

  if (!track || !slides.length) return;

  let current = 0;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    indexText.textContent = `${current + 1} / ${slides.length}`;
  }

  update();

  prev.onclick = () => {
    current = (current - 1 + slides.length) % slides.length;
    update();
  };

  next.onclick = () => {
    current = (current + 1) % slides.length;
    update();
  };
}


openBtn.addEventListener('click', () => {
  buildModal(dialog, data);
  dialog.showModal();
  initCarousel(dialog);

});


    closeBtn.addEventListener('click', () => dialog.close());

    function createVideo(media) {
      const wrap = document.createElement('div');
      wrap.className = 'video-wrap';

      const video = document.createElement('video');
      video.src = media.src;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;

      const label = document.createElement('div');
      label.className = 'video-label';
      label.textContent = media.label || '';

      wrap.append(video, label);

      video.addEventListener('play', () => {
        label.classList.add('hidden');
      });

      video.addEventListener('pause', () => {
        if (video.currentTime === 0) {
          label.classList.remove('hidden');
        }
      });

      video.addEventListener('ended', () => {
        video.currentTime = 0;
        label.classList.remove('hidden');
      });

      return wrap;
    }
});
});