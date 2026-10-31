(function(){
  const pageMeta = {
    about: {
      vi: { title: 'About · Fieldnotes on Learning', description: 'Về Tg, Learning Experience Designer tại Hà Nội và người viết Fieldnotes on Learning.' },
      en: { title: 'About · Fieldnotes on Learning', description: 'About Tg, a Learning Experience Designer in Hanoi and the author of Fieldnotes on Learning.' }
    },
    contact: {
      vi: { title: 'Contact · Fieldnotes on Learning', description: 'Liên hệ với Tg hoặc gửi một lời nhắn ẩn danh đến Fieldnotes on Learning.' },
      en: { title: 'Contact · Fieldnotes on Learning', description: 'Contact Tg or leave an anonymous note for Fieldnotes on Learning.' }
    }
  };

  function setPageLang(lang){
    if(lang !== 'en') lang = 'vi';
    document.documentElement.lang = lang;
    try { localStorage.setItem('tellstoryLang', lang); } catch(e) {}
    document.getElementById('page-vi')?.classList.toggle('active', lang === 'vi');
    document.getElementById('page-en')?.classList.toggle('active', lang === 'en');

    document.querySelectorAll('[data-vi][data-en]').forEach(function(el){
      const value = el.getAttribute('data-' + lang);
      if(value) el.innerHTML = value;
    });
    document.querySelectorAll('[data-placeholder-vi][data-placeholder-en]').forEach(function(el){
      el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang) || '');
    });

    const page = document.body.dataset.page;
    const meta = pageMeta[page] && pageMeta[page][lang];
    if(meta){
      document.title = meta.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    }
    document.dispatchEvent(new CustomEvent('tellstory:language', { detail: { lang: lang } }));
  }

  window.setPageLang = setPageLang;
  let initial = 'vi';
  try { initial = localStorage.getItem('tellstoryLang') || 'vi'; } catch(e) {}
  setPageLang(initial);
})();
