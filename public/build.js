const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const publicDir = __dirname;
const demoDir = path.join(__dirname, '..', 'demo');

const MAPS_API_KEY = (process.env.GOOGLE_MAPS_API_KEY || '').trim();

const partial = name => {
  let content = fs.readFileSync(path.join(src, name), 'utf-8');
  content = content.replaceAll('{{GOOGLE_MAPS_API_KEY}}', MAPS_API_KEY);
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
    '_brands.html',
    '_footer.html',
    '_scripts.html',
  ],
};

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, entry);
    const destPath = path.join(destDir, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

for (const [filename, partials] of Object.entries(pages)) {
  const html = partials.map(partial).join('\n');
  fs.writeFileSync(path.join(publicDir, filename), html);
  console.log(`Built public/${filename}`);
}

fs.mkdirSync(demoDir, { recursive: true });

for (const [filename, partials] of Object.entries(pages)) {
  const html = partials.map(partial).join('\n');
  fs.writeFileSync(path.join(demoDir, filename), html);
  console.log(`Built demo/${filename}`);
}

copyDir(path.join(publicDir, 'css'), path.join(demoDir, 'css'));
copyDir(path.join(publicDir, 'js'), path.join(demoDir, 'js'));
copyDir(path.join(publicDir, 'images'), path.join(demoDir, 'images'));

for (const file of ['favicon.png', 'form-mail.html']) {
  const srcFile = path.join(publicDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(demoDir, file));
    console.log(`Copied demo/${file}`);
  }
}

console.log('Demo site built to demo/');
