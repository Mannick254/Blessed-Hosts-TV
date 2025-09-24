// 🔐 XOR Encryption Logic (not AES)
function encrypt(text, key) {
  return btoa([...text].map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join(''));
}

function decrypt(cipher, key) {
  const decoded = atob(cipher);
  return [...decoded].map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
}

const secretKey = "blessedLegacy2025";

// 📰 News Feed with Search
if (document.getElementById('news-feed')) {
  fetch('data/news.json')
    .then(res => res.json())
    .then(news => {
      const feed = document.getElementById('news-feed');
      const searchInput = document.getElementById('search');

      function render(filtered) {
        feed.innerHTML = filtered.map(item => `
          <article>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <small>${item.date}</small>
          </article>
        `).join('');
      }

      render(news);

      if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
          clearTimeout(debounce);
          debounce = setTimeout(() => {
            const query = searchInput.value.toLowerCase();
            const filtered = news.filter(item =>
              item.title.toLowerCase().includes(query) ||
              item.summary.toLowerCase().includes(query)
            );
            render(filtered);
          }, 300);
        });
      }
    });
}

// 🎬 Movies
if (document.getElementById('movie-feed')) {
  fetch('data/movies.json')
    .then(res => res.json())
    .then(movies => {
      const feed = document.getElementById('movie-feed');
      feed.innerHTML = movies.map(movie => `
        <article>
          <h3>${movie.title}</h3>
          <p>${movie.synopsis}</p>
          <small>Released: ${movie.year}</small>
        </article>
      `).join('');
    });
}

// ⚔️ Conflicts
if (document.getElementById('conflict-feed')) {
  fetch('data/conflicts.json')
    .then(res => res.json())
    .then(conflicts => {
      const feed = document.getElementById('conflict-feed');
      feed.innerHTML = conflicts.map(item => `
        <section>
          <h3>${item.region}</h3>
          <p>${item.summary}</p>
          <small>Updated: ${item.date}</small>
        </section>
      `).join('');
    });
}

// 🔮 Predictions
if (document.getElementById('prediction-feed')) {
  fetch('data/predictions.json')
    .then(res => res.json())
    .then(predictions => {
      const feed = document.getElementById('prediction-feed');
      feed.innerHTML = predictions.map(item => `
        <div class="forecast">
          <h3>${item.title}</h3>
          <p>${item.insight}</p>
          <small>Forecasted for: ${item.futureDate}</small>
        </div>
      `).join('');
    });
}

// 👤 Biographies
if (document.getElementById('bio-feed')) {
  fetch('data/biographies.json')
    .then(res => res.json())
    .then(bios => {
      const feed = document.getElementById('bio-feed');
      feed.innerHTML = bios.map(person => `
        <section>
          <h3>${person.name}</h3>
          <p>${person.story}</p>
          <small>Born: ${person.birthYear}</small>
        </section>
      `).join('');
    });
}

// 🗣️ Legacy Quote Viewer
const quotes = [
  "“Legacy isn’t what you leave behind. It’s what you ignite.”",
  "“Emotion is the archive. Memory is the medium.”",
  "“Blessed are the voices that echo beyond their time.”",
  "“Truth told cinematically becomes culture.”"
];

function rotateQuotes() {
  const quoteBox = document.getElementById('legacy-quote');
  let index = 0;

  function showQuote() {
    quoteBox.innerText = quotes[index];
    index = (index + 1) % quotes.length;
    setTimeout(showQuote, 5000);
  }

  if (quoteBox) showQuote();
}

rotateQuotes();

// 🎞️ Typewriter Intro
const tagline = "Where legacy lives loud. Explore emotion, tension, and cinematic truth.";
let i = 0;

function typeWriter() {
  const el = document.getElementById("tagline");
  if (el && i < tagline.length) {
    el.innerHTML += tagline.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}

if (document.getElementById("tagline")) {
  typeWriter();
}

// 🛡️ Admin Upload (Encrypted)
if (document.getElementById('upload-form')) {
  document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const section = document.getElementById('section').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!section || !title || !content) {
      document.getElementById('status').innerText = "All fields are required.";
      return;
    }

    const draft = {
      title: encrypt(title, secretKey),
      summary: encrypt(content, secretKey),
      date: encrypt(new Date().toISOString().split('T')[0], secretKey)
    };

    const key = `draft-${section}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(draft);
    localStorage.setItem(key, JSON.stringify(existing));

    document.getElementById('status').innerText = "Encrypted draft saved.";
    this.reset();
  });
}

// 🗂️ Draft Viewer
function loadDrafts() {
  const section = document.getElementById('section').value;
  const key = `draft-${section}`;

  const encrypted = JSON.parse(localStorage.getItem(key) || '[]');
  const decrypted = encrypted.map(d => ({
    title: decrypt(d.title, secretKey),
    summary: decrypt(d.summary, secretKey),
    date: decrypt(d.date, secretKey)
  }));

  const feed = document.getElementById('draft-feed');
  if (feed) {
    feed.innerHTML = decrypted.map((item, index) => `
      <article>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <small>Saved: ${item.date}</small>
        <button onclick="publishDraft('${section}', ${index})">Publish to GitHub</button>
      </article>
    `).join('');
  }
}

// ✅ Publish Confirmation Modal
function showModal() {
  document.getElementById('publish-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('publish-modal').classList.add('hidden');
}

// 🌐 GitHub Sync via Secure Backend
async function pushToGitHub(section, entry) {
  try {
    document.getElementById('status').innerText = "Publishing to GitHub...";
    await fetch('https://your-backend.com/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, entry })
    });
    showModal();
    document.getElementById('status').innerText = "Published successfully.";
  } catch (error) {
    console.error("Publishing failed:", error);
    document.getElementById('status').innerText = "Publishing failed. Try again.";
  }
}

// 🔘 Publish Button Logic
function publishDraft(section, index) {
  const key = `draft-${section}`;
  const encrypted = JSON.parse(localStorage.getItem(key) || '[]');
  const entry = encrypted[index];

  const decryptedEntry = {
    title: decrypt(entry.title, secretKey),
    summary: decrypt(entry.summary, secretKey),
    date: decrypt(entry.date, secretKey)
  };

  pushToGitHub(section, decryptedEntry);
}

// ⚙️ Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registered"));
}
