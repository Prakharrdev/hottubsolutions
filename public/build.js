const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const out = __dirname;

const partial = name => {
  const content = fs.readFileSync(path.join(src, name), 'utf-8');
  return `<!-- START: ${name} -->\n${content}\n<!-- END: ${name} -->`;
};

const pages = {
  'index.html': [
    '_head.html',
    '_nav.html',
    '_hero.html',
    '_about.html',
    '_services.html',
    '_reviews.html',
    '_inventory.html',
    '_badges.html',
    '_serving.html',
    '_map.html',
    '_footer.html',
    '_scripts.html',
  ],
};

for (const [filename, partials] of Object.entries(pages)) {
  const html = partials.map(partial).join('\n');

  // Write to public/
  fs.writeFileSync(path.join(out, filename), html);
  console.log(`Built public/${filename}`);

  // Also write to demo/ so Vercel can serve it as a real static file
  const demoDir = path.join(out, '..', 'demo');
  if (fs.existsSync(demoDir)) {
    fs.writeFileSync(path.join(demoDir, filename), html);
    console.log(`Synced  demo/${filename}`);
  }
}
