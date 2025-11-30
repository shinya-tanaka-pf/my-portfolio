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
      });

      newPcWhiteBtn?.addEventListener('click', () => {
        changerLeft.classList.remove('dark');
        changerRight.classList.add('dark');
        changerSc.classList.add('dark'); 
      });

    } else {
      newSpWhiteBtn.addEventListener('click', () => {
        changerLeft.classList.remove('dark');
        changerRight.classList.remove('dark');
        changerSc.classList.remove('dark');
      });

      newSpBlackBtn.addEventListener('click', () => {
        changerLeft.classList.add('dark');
        changerRight.classList.add('dark');
        changerSc.classList.add('dark'); 
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
  const sections = document.querySelectorAll('.section-top');
  const scrollBtn = document.querySelector('.nextpage');
  let currentIndex = 0;

  scrollBtn.addEventListener('click', () => {
    currentIndex++;

    // 最後のセクションまで来たらトップへ戻る
    if (currentIndex >= sections.length) {
      currentIndex = 0;
    }

    sections[currentIndex].scrollIntoView({ behavior: 'smooth' });

    // ▼ クラス切り替え（最後の一つ前ならreverseに）
    if (currentIndex === sections.length - 1) {
      scrollBtn.classList.add('reverse');
    } else {
      scrollBtn.classList.remove('reverse');
    }
  });
  
  // フィルター機能
(function(){
  const toolbar = document.querySelector('.filters');
  const buttons = document.querySelectorAll('.filters button');
  const items = Array.from(document.querySelectorAll('.w-item'));
  const status = document.getElementById('filter-status');
  const grid = document.getElementById('w-grid'); // 追加

  function updateStatus(filter) {
    const visibleCount = items.filter(i => !i.classList.contains('is-hidden')).length;
    status.textContent = filter === 'all'
      ? `display:${visibleCount}`
      : `display:${filter} ${visibleCount}`;
  }
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

});

/* dialogによるモーダル */
document.querySelectorAll('.w-item').forEach(item => {

    const dialog   = item.querySelector('.myDialog');
    const openBtn  = item.querySelector('.openButton');
    const closeBtn = item.querySelector('.closeButton');

    const track = dialog.querySelector('.carousel-track');
    const slides = dialog.querySelectorAll('.carousel-item');
    const prev = dialog.querySelector('.prev');
    const next = dialog.querySelector('.next');
    const indexText = dialog.querySelector('.carousel-index');

    let current = 0;

    /** カルーセル更新 **/
    function updateCarousel() {
        track.style.transform = `translateX(-${current * 100}%)`;
        indexText.textContent = `${current + 1} / ${slides.length}`;
    }

    /** スライドボタン **/
    prev.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    next.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        updateCarousel();
    });

    /** モーダル **/
    openBtn.addEventListener('click', () => {
        dialog.showModal();
        current = 0;
        updateCarousel();
    });

    closeBtn.addEventListener('click', () => dialog.close());
});
