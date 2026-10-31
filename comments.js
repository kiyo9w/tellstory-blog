import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const labels = {
  vi: {
    title: 'bình luận',
    kicker: 'phản hồi của bạn đọc',
    lead: 'Bạn có thể để lại suy nghĩ, câu hỏi hoặc góp ý. Bình luận sẽ hiện sau khi Tg duyệt.',
    name: 'tên hoặc nickname, không bắt buộc',
    message: 'bình luận',
    placeholderName: 'Để trống nếu muốn ẩn danh',
    placeholderMessage: 'Viết bình luận của bạn ở đây...',
    submit: 'gửi bình luận',
    sending: 'đang gửi...',
    ready: 'Bình luận mới sẽ được gửi đến Tg để duyệt.',
    short: 'Vui lòng viết bình luận trước khi gửi.',
    long: 'Bình luận hơi dài, bạn rút gọn dưới 2000 ký tự giúp mình nhé.',
    sent: 'Đã gửi bình luận. Bình luận sẽ hiện sau khi Tg duyệt.',
    failed: 'Chưa gửi được bình luận. Bạn thử lại sau nhé.',
    loading: 'Đang tải bình luận...',
    empty: 'Chưa có bình luận nào được duyệt.',
    reply: 'Tg trả lời',
    anonymous: 'ẩn danh'
  },
  en: {
    title: 'comments',
    kicker: 'reader responses',
    lead: 'You can leave a thought, question, or note. Comments appear after Tg reviews them.',
    name: 'name or nickname, optional',
    message: 'comment',
    placeholderName: 'leave blank to stay anonymous',
    placeholderMessage: 'write your comment here...',
    submit: 'send comment',
    sending: 'sending...',
    ready: 'New comments will be sent to Tg for review.',
    short: 'Please write a comment before sending.',
    long: 'This comment is a little long. Please keep it under 2000 characters.',
    sent: 'Comment sent. It will appear after Tg reviews it.',
    failed: 'Could not send this comment yet. Please try again later.',
    loading: 'Loading comments...',
    empty: 'No approved comments yet.',
    reply: 'Tg replies',
    anonymous: 'anonymous'
  }
};

const commentStates = new Map();

function normalizeLang(value) {
  return String(value || '').toLowerCase().startsWith('en') ? 'en' : 'vi';
}

function getActiveLang(section) {
  if (document.body?.classList.contains('en')) return 'en';
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang) return normalizeLang(htmlLang);
  return normalizeLang(section.getAttribute('data-comment-lang') || 'vi');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function formatDate(value, lang) {
  if (!value) return '';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getPostSlug(section) {
  const explicit = section.getAttribute('data-post-slug');
  if (explicit) return explicit;
  const file = location.pathname.split('/').pop() || 'index.html';
  return file.replace(/\.html$/i, '') || 'index';
}

function getPostTitle(section) {
  return section.getAttribute('data-post-title') || document.title || '';
}

function renderShell(section, lang) {
  const t = labels[lang] || labels.vi;
  section.innerHTML = `
    <div class="comments-inner">
      <div class="comments-kicker">${t.kicker}</div>
      <h2 class="comments-title">${t.title}</h2>
      <p class="comments-lead">${t.lead}</p>
      <form class="comments-form">
        <label class="comments-label" for="comment-name">${t.name}</label>
        <input class="comments-input" id="comment-name" name="name" type="text" maxlength="80" placeholder="${t.placeholderName}">
        <label class="comments-label" for="comment-message">${t.message}</label>
        <textarea class="comments-textarea" id="comment-message" name="message" required maxlength="2000" placeholder="${t.placeholderMessage}"></textarea>
        <button class="comments-submit" type="submit">${t.submit}</button>
        <div class="comments-status">${t.ready}</div>
      </form>
      <div class="comments-list" aria-live="polite">
        <div class="comments-empty">${t.loading}</div>
      </div>
    </div>
  `;
}

function renderComments(section, comments, lang) {
  const list = section.querySelector('.comments-list');
  if (!list) return;
  const t = labels[lang] || labels.vi;
  if (!comments.length) {
    list.innerHTML = `<div class="comments-empty">${t.empty}</div>`;
    return;
  }

  list.innerHTML = comments.map((item) => {
    const name = escapeHtml(item.name || t.anonymous);
    const date = escapeHtml(formatDate(item.createdAt, lang) || item.createdAtClient || '');
    const reply = item.authorReply
      ? `<div class="comment-reply"><div class="comment-reply-label">${t.reply}</div><div class="comment-reply-text">${escapeHtml(item.authorReply)}</div></div>`
      : '';
    return `
      <article class="comment-card">
        <div class="comment-meta"><span class="comment-name">${name}</span><span>${date}</span></div>
        <div class="comment-message">${escapeHtml(item.message)}</div>
        ${reply}
      </article>
    `;
  }).join('');
}

async function fetchApprovedComments(postSlug) {
  const q = query(collection(db, 'article_comments'), where('status', '==', 'approved'));
  const snap = await getDocs(q);
  return snap.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((item) => item.postSlug === postSlug)
    .sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() || new Date(a.createdAtClient || 0);
      const bDate = b.createdAt?.toDate?.() || new Date(b.createdAtClient || 0);
      return aDate - bDate;
    });
}

function setupForm(section, state) {
  const form = section.querySelector('.comments-form');
  const status = section.querySelector('.comments-status');
  const submit = section.querySelector('.comments-submit');
  if (!form || !status || !submit) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const lang = getActiveLang(section);
    const t = labels[lang] || labels.vi;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (message.length < 2) {
      status.textContent = t.short;
      return;
    }
    if (message.length > 2000) {
      status.textContent = t.long;
      return;
    }

    submit.disabled = true;
    submit.textContent = t.sending;
    status.textContent = t.sending;

    try {
      await addDoc(collection(db, 'article_comments'), {
        postSlug: state.postSlug,
        postTitle: state.postTitle,
        name,
        message,
        status: 'pending',
        authorReply: '',
        authorReplyAt: null,
        createdAt: serverTimestamp(),
        createdAtClient: new Date().toISOString()
      });
      form.reset();
      status.textContent = t.sent;
    } catch (error) {
      console.error(error);
      status.textContent = t.failed;
    } finally {
      submit.disabled = false;
      submit.textContent = (labels[getActiveLang(section)] || labels.vi).submit;
    }
  });
}

function renderSection(section, state, lang = getActiveLang(section)) {
  const previousName = section.querySelector('[name="name"]')?.value || '';
  const previousMessage = section.querySelector('[name="message"]')?.value || '';

  state.lang = lang;
  renderShell(section, lang);
  section.querySelector('[name="name"]')?.setAttribute('value', previousName);
  const messageEl = section.querySelector('[name="message"]');
  if (messageEl) messageEl.value = previousMessage;
  setupForm(section, state);

  if (state.loading) {
    const t = labels[lang] || labels.vi;
    const list = section.querySelector('.comments-list');
    if (list) list.innerHTML = `<div class="comments-empty">${t.loading}</div>`;
    return;
  }

  renderComments(section, state.comments, lang);
}

function initCommentsSection(section) {
  const state = {
    postSlug: getPostSlug(section),
    postTitle: getPostTitle(section),
    comments: [],
    loading: true,
    lang: getActiveLang(section)
  };

  commentStates.set(section, state);
  renderSection(section, state, state.lang);

  fetchApprovedComments(state.postSlug)
    .then((comments) => {
      state.comments = comments;
      state.loading = false;
      renderComments(section, state.comments, state.lang);
    })
    .catch((error) => {
      console.error(error);
      state.loading = false;
      state.comments = [];
      renderComments(section, state.comments, state.lang);
    });
}

function refreshCommentLanguages() {
  commentStates.forEach((state, section) => {
    const nextLang = getActiveLang(section);
    if (nextLang !== state.lang) {
      renderSection(section, state, nextLang);
    }
  });
}

let refreshQueued = false;
function scheduleCommentRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  queueMicrotask(() => {
    refreshQueued = false;
    refreshCommentLanguages();
  });
}

document.querySelectorAll('[data-comments]').forEach(initCommentsSection);

new MutationObserver(scheduleCommentRefresh).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});

if (document.body) {
  new MutationObserver(scheduleCommentRefresh).observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
}

window.addEventListener('tellstory:langchange', scheduleCommentRefresh);
