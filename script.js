(() => {
  const output = document.getElementById('output');
  const boot = document.getElementById('boot');
  const input = document.getElementById('cmd-input');
  const terminal = document.getElementById('terminal');

  const GH = 'https://github.com/gafarbalogun';
  const EMAIL = 'gbalogun26@gmail.com';

  const files = {
    'whoami.txt': () => `<span class="hl">Gafar Balogun</span>
Cyber Defense Specialist @ Citizens
Pivoting into Cloud Security / Platform Engineering

Day to day: Wiz across CSPM, CWPP, and KSPM — cloud posture,
workload protection, and Kubernetes security in one pane of glass.`,

    'wiz.log': () => `<span class="section-title">Wiz — daily driver</span>
Operate Wiz across three surfaces:
  <span class="accent">CSPM</span>  cloud posture across AWS accounts
  <span class="accent">CWPP</span>  workload protection, runtime risk
  <span class="accent">KSPM</span>  Kubernetes security posture

Reviewed our full SOC detection catalog end-to-end — scored each
rule on difficulty to tune, log availability, and how far it can
realistically be automated. That review is what surfaced the
pod-replication gap below.`,

    'incidents.log': () => `<span class="section-title">Jenkins pipeline — cascading failure</span>
A blocked <span class="hl">PowerShell.exe</span> alert cleared from a security
standpoint, but the Jenkins pipeline it touched kept failing.
No one from cyber was looped into the incident that got raised.
I stepped in as the bridge — traced it back through prior alerts,
found it was a recurring <span class="warn">threshold</span> issue, not a new one,
and re-applied a prior fix to extend the timeout. Resolved.

<span class="section-title">/etc/passwd detection — pod replication gap</span>
A detection tuned to catch modifications to sensitive files like
<span class="hl">/etc/passwd</span> didn't account for pod replication — a new pod
writing fresh credentials on startup looks identical to tampering.
Catching it took direct knowledge of how <span class="accent">Kubernetes scheduling
and replication</span> actually behave. Fix: <span class="warn">in progress</span>.`,

    'training.md': () => `<span class="section-title">AWS training series — self-started</span>
Built and taught an AWS series for incoming interns, added on top
of their standard onboarding. Delivered over their 10-week internship.

  <span class="accent">Week block 1</span>  VPC design (subnets, routing, NACLs/SGs)
  <span class="accent">Week block 2</span>  EC2 deployment
  <span class="accent">Week block 3</span>  S3

Wanted them writing and breaking real infra early, not just reading
about it.`,

    'focus.md': () => `<span class="section-title">Where this is headed</span>
Moving toward <span class="accent">platform engineering</span> — designing secure,
observable cloud-native infrastructure across AWS and Kubernetes,
rather than only responding to findings after the fact.

Building toward that hands-on: Terraform, EKS, and open-source
security tooling. Always glad to connect with people doing similar
work — see <span class="accent">contact</span>.`,

    'certs.txt': () => `<span class="section-title">certifications</span>
  <span class="ok">[x]</span> AWS Certified Solutions Architect – Associate
  <span class="ok">[x]</span> AWS Certified Cloud Practitioner
  <span class="warn">[~]</span> Certified Kubernetes Administrator (CKA) <span class="dim">— in progress</span>
  <span class="ok">[x]</span> CompTIA Linux+
  <span class="ok">[x]</span> Microsoft Certified: Azure Fundamentals (AZ-900)`,
  };

  const certList = [
    { name: 'AWS Certified Solutions Architect – Associate', status: 'done' },
    { name: 'AWS Certified Cloud Practitioner', status: 'done' },
    { name: 'Certified Kubernetes Administrator (CKA)', status: 'progress' },
    { name: 'CompTIA Linux+', status: 'done' },
    { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', status: 'done' },
  ];

  let posts = [];
  fetch('posts.json').then(r => r.json()).then(data => { posts = data; }).catch(() => {});

  const projects = [
    {
      name: 'cnapp-eks',
      desc: 'CNAPP-style security platform built on EKS — Terraform-provisioned, cloud-native detection/response patterns.',
      url: `${GH}/cnapp-eks`,
    },
    {
      name: 'secure-pipeline',
      desc: 'CI/CD pipeline hardened with security gates baked into the workflow, not bolted on after.',
      url: `${GH}/secure-pipeline`,
    },
    {
      name: 'iac-test',
      desc: 'Terraform / infrastructure-as-code sandbox for testing modules before they touch anything real.',
      url: `${GH}/iac-test`,
    },
  ];

  function esc(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function print(html, cls){
    const div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    output.appendChild(div);
  }

  function printEcho(cmdText){
    const div = document.createElement('div');
    div.className = 'echo-line';
    div.innerHTML = `<span class="prompt-mini">gafar@cloud-sec:~$</span> ${esc(cmdText)}`;
    output.appendChild(div);
  }

  function scrollDown(){
    terminal.scrollTop = terminal.scrollHeight;
  }

  function fmtDate(iso){
    const d = new Date(iso + 'T00:00:00Z');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  const commands = {
    help(){
      print(`<span class="section-title">available commands</span>
  <span class="accent">whoami</span>          who I am, role, focus
  <span class="accent">about</span>            same as whoami
  <span class="accent">wiz</span>              Wiz CSPM / CWPP / KSPM work
  <span class="accent">incidents</span>        two things I'm proud of
  <span class="accent">training</span>         AWS intern training series
  <span class="accent">focus</span>            where I'm headed — platform engineering
  <span class="accent">ls</span>               list project files
  <span class="accent">cat &lt;file&gt;</span>      read a project/log file
  <span class="accent">projects</span>         same as ls, expanded view
  <span class="accent">blog</span>              latest posts from medium.com/@gafar.cloud
  <span class="accent">certs</span>             certifications
  <span class="accent">contact</span>          how to reach me
  <span class="accent">clear</span>            clear the screen`);
    },
    certs(){ print(files['certs.txt']()); },
    blog(){
      if (!posts.length) {
        print(`<span class="dim">loading posts... run 'blog' again in a second, or read them directly at</span> <a href="https://medium.com/@gafar.cloud" target="_blank" rel="noopener">medium.com/@gafar.cloud</a>`);
        return;
      }
      let block = `<span class="section-title">blog — medium.com/@gafar.cloud</span>\n`;
      posts.forEach(p => {
        block += `  <span class="hl">${esc(p.title)}</span>\n`;
        block += `  <span class="dim">${fmtDate(p.date)} · ${p.tags.join(', ')}</span>\n`;
        block += `  ${esc(p.snippet)}\n`;
        block += `  <a href="${p.url}" target="_blank" rel="noopener">${p.url}</a>\n\n`;
      });
      print(block.trim());
    },
    whoami(){ print(files['whoami.txt']()); },
    about(){ commands.whoami(); },
    wiz(){ print(files['wiz.log']()); },
    incidents(){ print(files['incidents.log']()); },
    training(){ print(files['training.md']()); },
    focus(){ print(files['focus.md']()); },
    contact(){
      print(`<span class="section-title">contact</span>
  github    <a href="${GH}" target="_blank" rel="noopener">github.com/gafarbalogun</a>
  email     <a href="mailto:${EMAIL}">${EMAIL}</a>`);
    },
    ls(args){
      if (args[0] === 'projects' || args[0] === 'projects/') {
        return commands.projects();
      }
      const names = Object.keys(files).map(f => `<span class="tree f">${f}</span>`).join('   ');
      print(`<span class="tree d">projects/</span>   ${names}`);
    },
    projects(){
      let block = `<span class="section-title">projects</span>\n`;
      projects.forEach(p => {
        block += `  <span class="accent">${p.name}</span>\n    ${p.desc}\n    <a href="${p.url}" target="_blank" rel="noopener">${p.url}</a>\n\n`;
      });
      block += `<span class="dim">more on <a href="${GH}?tab=repositories" target="_blank" rel="noopener">github.com/gafarbalogun</a></span>`;
      print(block);
    },
    cat(args){
      const name = (args[0] || '').replace(/^\.\//, '');
      if (!name) { print(`cat: missing operand`, 'err'); return; }
      if (files[name]) { print(files[name]()); return; }
      const proj = projects.find(p => name.includes(p.name));
      if (proj) {
        print(`<span class="accent">${proj.name}</span>\n${proj.desc}\n<a href="${proj.url}" target="_blank" rel="noopener">${proj.url}</a>`);
        return;
      }
      print(`cat: ${esc(name)}: No such file or directory`, 'err');
    },
    clear(){ output.innerHTML = ''; },
    sudo(){ print(`Nice try. This user has no elevated privileges on this box.`, 'warn'); },
  };

  function run(raw){
    const trimmed = raw.trim();
    printEcho(raw);
    if (!trimmed) { return; }
    const [cmd, ...args] = trimmed.split(/\s+/);
    const key = cmd.toLowerCase();
    if (commands[key]) {
      commands[key](args);
    } else {
      print(`command not found: ${esc(cmd)} <span class="dim">— try 'help'</span>`, 'err');
    }
  }

  // --- autocomplete ---
  const acToggle = document.getElementById('ac-toggle');
  const ghost = document.getElementById('ghost');
  const commandNames = Object.keys(commands).sort();
  let acEnabled = localStorage.getItem('ac-enabled') !== 'off';
  acToggle.checked = acEnabled;

  function matchesFor(val){
    if (!val) return [];
    return commandNames.filter(c => c.startsWith(val.toLowerCase()));
  }

  function updateGhost(){
    if (!acEnabled) { ghost.textContent = ''; return; }
    const val = input.value;
    const matches = matchesFor(val);
    if (matches.length === 1 && matches[0] !== val.toLowerCase()) {
      ghost.textContent = val + matches[0].slice(val.length);
    } else {
      ghost.textContent = '';
    }
  }

  acToggle.addEventListener('change', () => {
    acEnabled = acToggle.checked;
    localStorage.setItem('ac-enabled', acEnabled ? 'on' : 'off');
    updateGhost();
  });

  input.addEventListener('input', updateGhost);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      ghost.textContent = '';
      run(val);
      scrollDown();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!acEnabled) return;
      const val = input.value;
      const matches = matchesFor(val);
      if (matches.length === 1) {
        input.value = matches[0] + ' ';
        ghost.textContent = '';
      } else if (matches.length > 1) {
        print(`<span class="dim">${matches.join('   ')}</span>`);
        scrollDown();
      }
      return;
    }
    if (e.key === 'ArrowRight' && ghost.textContent && input.selectionStart === input.value.length) {
      input.value = ghost.textContent;
      ghost.textContent = '';
    }
  });

  terminal.addEventListener('click', () => input.focus());

  // --- view mode toggle (terminal vs regular scrolling page) ---
  const crt = document.getElementById('crt');
  const regular = document.getElementById('regular');
  const modeToggle = document.getElementById('mode-toggle');
  const modeLabel = document.getElementById('mode-toggle-label');

  function renderRegular(){
    const projList = document.getElementById('reg-projects-list');
    projList.innerHTML = projects.map(p => `
      <div class="reg-card">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <a href="${p.url}" target="_blank" rel="noopener">${p.url}</a>
      </div>`).join('');

    const certsSection = document.querySelector('#reg-projects');
    if (!document.getElementById('reg-certs')) {
      const section = document.createElement('section');
      section.className = 'reg-section';
      section.id = 'reg-certs';
      section.innerHTML = `<h2>Certifications</h2><div class="reg-cards" id="reg-certs-list"></div>`;
      certsSection.parentNode.insertBefore(section, certsSection);
    }
    document.getElementById('reg-certs-list').innerHTML = certList.map(c => `
      <div class="reg-card">
        <h3>${c.status === 'done' ? '✓' : '~'} ${esc(c.name)}</h3>
        ${c.status === 'progress' ? '<p class="dim">in progress</p>' : ''}
      </div>`).join('');

    const blogList = document.getElementById('reg-blog-list');
    if (posts.length) {
      blogList.innerHTML = posts.map(p => `
        <div class="reg-card">
          <h3>${esc(p.title)}</h3>
          <div class="meta">${fmtDate(p.date)} · ${p.tags.join(', ')}</div>
          <p>${esc(p.snippet)}</p>
          <a href="${p.url}" target="_blank" rel="noopener">Read on Medium</a>
        </div>`).join('');
    } else {
      blogList.innerHTML = `<p class="dim">loading posts...</p>`;
      setTimeout(renderRegular, 500);
    }
  }

  function setMode(mode){
    localStorage.setItem('view-mode', mode);
    if (mode === 'regular') {
      crt.hidden = true;
      regular.hidden = false;
      modeLabel.textContent = 'terminal view';
      renderRegular();
    } else {
      crt.hidden = false;
      regular.hidden = true;
      modeLabel.textContent = 'regular view';
      input.focus();
    }
  }

  modeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('view-mode') === 'regular' ? 'regular' : 'terminal';
    setMode(current === 'regular' ? 'terminal' : 'regular');
  });

  setMode(localStorage.getItem('view-mode') === 'regular' ? 'regular' : 'terminal');

  const bootLines = [
    ['boot', 'cloud-sec-terminal v1.0.0 — initializing session...'],
    ['ok',   'auth: session authenticated as gafar'],
    ['ok',   'link: wiz-cspm, wiz-cwpp, wiz-kspm — connected'],
    ['dim',  `type 'help' to see available commands`],
  ];

  let i = 0;
  function typeBoot(){
    if (i >= bootLines.length) {
      commands.whoami();
      print('');
      input.focus();
      scrollDown();
      return;
    }
    const [cls, text] = bootLines[i++];
    const div = document.createElement('div');
    div.className = 'line ' + (cls === 'ok' ? 'ok' : cls === 'boot' ? 'bar' : 'dim');
    div.textContent = text;
    boot.appendChild(div);
    scrollDown();
    setTimeout(typeBoot, 160);
  }
  typeBoot();
})();
