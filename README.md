# Fieldnotes on Learning (`tellstory-blog.web.app`)

Full end-to-end recovery of **Fieldnotes on Learning** (`https://tellstory-blog.web.app/`), including the bilingual scrollytelling articles, the **Sakura Irregular Verbs** EdTech mini-app ecosystem, the moderation dashboard (`admin.html`), Firebase Hosting & Firestore configuration, recovered passcodes, and public Firestore records.

- **Canonical path:** `/Users/ngotrung/Documents/Projects/tellstory-blog`
- **Canonical branch:** `main`
- **Verbatim live snapshot commit:** `6ed5ae8` (all 69 files exactly as served by `tellstory-blog.web.app`)

---

## 1. Repository Structure

### Scrollytelling Essays & Site Pages
- `index.html` — Homepage with topic filter, search, and bilingual metadata (`TOPICS` / article catalog)
- `about.html`, `contact.html`, `pages.css`, `pages.js`, `font-normalize.css` — About & Contact pages (with anonymous message dropbox writing to Firestore `anonymous_messages`)
- `admin.html` — Admin console (Google Sign-In for `buitonggiang0805@gmail.com`) to read/delete `anonymous_messages` and approve/reply/delete `article_comments`
- `post-template.html` — Author's starter template for new blog posts
- `comments.js`, `comments.css` — Client-side Firestore comment widget (`article_comments`)
- **Articles:**
  - `sakura-im-lang.html` & `sakura-im-lang-en.html` — *"Tg muốn Sakura im lặng"* / *"Tg Wanted Sakura to Stay Quiet"*
  - `goed-thuat-toan.html` — *"Khi go biến thành goed"*
  - `goed-du-lieu.html` — *"Khi goed trở thành dữ liệu"*
  - `readiness-debt.html` — *"Readiness debt: khi AI nhanh hơn sự sẵn sàng"*
  - `starbucks-tank-day.html` — *"Starbucks, chiếc xe tăng và 30 giây đọc bối cảnh"*
  - `jjk-pedagogy.html` — *"Jujutsu Kaisen và 3 kiểu người thầy"*
  - `pizza-4ps-training.html` — *"Pizza 4P's đào tạo nhân viên như thế nào?"*
  - `agi-duong-vien-rang-cua.html` — *"AGI và đường viền răng cưa"*
  - `lms-khong-chet.html` — *"LMS không chết, nó chỉ đang bị AI bắt phải trưởng thành"*
  - `attention-is-the-new-classroom.html` — *"Sự tập trung của bộ não và bức tranh đào tạo"*
  - `nguoi-thay-bien-mat.html` & `nguoi-thay-bien-mat-en.html` — *"Liệu người thầy có thật sự biến mất"*

### Sakura Irregular Verbs Mini-App Ecosystem
- `irregular-verbs.html` — Interactive adaptive learning app (93 irregular verbs across 6 morphological clusters, half-life decay scheduler, WebAudio synthesizer + Web Speech API voice lines, XP/hearts/streak/blossom gamification, ablation conditions `full`, `no_reward`, `no_hint`, `no_sakura`, `quiet_measure`, and dual `localStorage` + Firestore `irregular_v11_students` persistence)
- `assets/sakura-mascot.html` — **Sakura Mascot v7 (Anime Bloom)** embedded via `<iframe>` (`?embed=1`), controlled via `window.postMessage({ type: 'sakura-state', state, streak, hearts, mastery })`
- `assets/sakura-gamification.css` & `assets/sakura-reference.png` — Sakura styling and reference illustration
- `irregular-report.html` — Teacher & Research Analytics Dashboard (realtime Firestore `onSnapshot` listeners, calibration tables, ablation comparisons, teacher decision overrides, CSV/JSON exporters)
- `irregular-verbs-guide.html` — Detailed guide to the Sakura learning app & cluster error model
- `irregular-verb-scheduler-demo.html` — Standalone interactive simulator of the cluster-aware spacing algorithm

---

## 2. Passcode Hashes (`HASHES` in `irregular-verbs.html` & `irregular-report.html`)

| Role / ID | Label | SHA-256 Hash |
| :--- | :--- | :--- |
| `L01` | Learner A | `3ae88e74b4f6e7e58bc12ed8cd36fe2161aa15ed55301c2aa4371798bb0e43fc` |
| `L02` | Learner B | `dcfbf8123c0e3dce49207dbe2d8e9b9bd513afad5c593fd4cb60370e7727cc88` |
| `teacher` | Teacher / Research Report | `91fdf38c3bb5c676e35b1a3b9306635f14c07421eb94f37cb5940f25e10cc8e0` |

---

## 3. Running & Deploying Locally

### Local static preview
```bash
python3 -m http.server 8080
# Open http://localhost:8080/ and http://localhost:8080/sakura-im-lang.html
```

### Firebase CLI deployment
```bash
firebase serve --only hosting
firebase deploy
```
