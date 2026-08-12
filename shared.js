const GH = 'https://github.com/gafarbalogun';
const EMAIL = 'gbalogun26@gmail.com';

const projects = [
  {
    name: 'cnapp-eks',
    desc: 'Rebuilding a commercial CNAPP on EKS from open-source tools — Prowler (CSPM), Kubescape (KSPM), Falco (CWPP), Trivy Operator. Mid-build.',
    url: `${GH}/cnapp-eks`,
    status: 'in progress',
  },
  {
    name: 'secure-pipeline',
    desc: 'First hands-on shift-left build: a Flask app, non-root Dockerfile, and a deploy script gated on Bandit + Trivy scans. Kept as a record of where it started.',
    url: `${GH}/secure-pipeline`,
    status: 'done',
  },
  {
    name: 'iac-test',
    desc: 'Terraform / infrastructure-as-code sandbox for testing modules before they touch anything real.',
    url: `${GH}/iac-test`,
    status: 'active',
  },
];

const certList = [
  { name: 'AWS Certified Solutions Architect – Associate', status: 'done' },
  { name: 'AWS Certified Cloud Practitioner', status: 'done' },
  { name: 'Certified Kubernetes Administrator (CKA)', status: 'progress' },
  { name: 'CompTIA Linux+', status: 'done' },
  { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', status: 'done' },
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
      <div class="card-top">
        <h3>${esc(p.name)}</h3>
        <span class="badge ${p.status === 'done' ? 'badge-ok' : p.status === 'in progress' ? 'badge-warn' : 'badge-active'}">${esc(p.status)}</span>
      </div>
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
