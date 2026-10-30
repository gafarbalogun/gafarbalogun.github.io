const GH = 'https://github.com/gafarbalogun';
const LINKEDIN = 'https://linkedin.com/in/gafarbalogun';
const EMAIL = 'gbalogun26@gmail.com';

const projects = [
  {
    name: 'secure-pipeline',
    desc: 'Reusable for exploring a local security-gated deployment: Bandit checks Flask source, Trivy checks the Docker image, and the replacement runs only after both checks pass.',
    url: `${GH}/secure-pipeline`,
    status: 'reusable',
  },
  {
    name: 'mac-lib',
    desc: 'Reusable for macOS package inventory, maintenance, and local vulnerability checks across multiple package managers. Includes repeatable CLI commands and protected-path guardrails.',
    url: `${GH}/mac-lib`,
    status: 'reusable',
  },
];

const certList = [
  { name: 'AWS Certified Solutions Architect – Associate', status: 'reusable' },
  { name: 'AWS Certified Cloud Practitioner', status: 'reusable' },
  { name: 'CompTIA Linux+', status: 'reusable' },
  { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', status: 'reusable' },
];

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function fmtDate(iso){
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function fetchPosts(){
  return fetch('posts.json').then(r => r.json()).catch(() => []);
}

function projectCard(p){
  return `
    <div class="card">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      <a href="${p.url}" target="_blank" rel="noopener">${p.url.replace('https://', '')}</a>
    </div>`;
}

function postCard(p){
  return `
    <div class="card">
      <h3>${esc(p.title)}</h3>
      <div class="meta">${fmtDate(p.date)} · ${p.tags.join(', ')}</div>
      <p>${esc(p.snippet)}</p>
      <a href="${p.url}" target="_blank" rel="noopener">Read on Medium →</a>
    </div>`;
}

function certRow(c){
  return `<div class="cert-row"><span class="cert-icon ${c.status === 'done' ? 'ok' : 'warn'}">${c.status === 'done' ? '✓' : '~'}</span> ${esc(c.name)}${c.status === 'progress' ? ' <span class="dim">— in progress</span>' : ''}</div>`;
}
