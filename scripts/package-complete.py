"""Entrega conjunta das versões HTML/CSS/JS e Next.js, em pastas independentes."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

root = Path(__file__).resolve().parent.parent
target = root / 'dist/grupo-vital-premium.zip'
target.parent.mkdir(exist_ok=True)
prefix = Path('grupo-vital-premium')

next_files = [
    '.env.example', '.gitignore', '.npmrc', 'AGENTS.md', 'eslint.config.mjs',
    'next-env.d.ts', 'next.config.ts', 'package.json', 'package-lock.json',
    'playwright.config.ts', 'postcss.config.mjs', 'tsconfig.json',
]
next_dirs = ['src', 'public', 'tests', 'docs']
next_scripts = ['asset-manifest.mjs', 'check-assets.mjs', 'import-assets.mjs', 'package.py']

def files(folder):
    for item in sorted(folder.rglob('*')):
        if item.is_file() and not item.is_symlink() and item.name not in {'.DS_Store', '.gitkeep'}:
            yield item

def verify_originals(folder):
    records = json.loads((folder / 'public/images/asset-records.json').read_text())
    if len(records) != 6:
        raise ValueError(f'Esperados seis originais: {folder}')
    for record in records:
        data = (folder / record['original']).read_bytes()
        if hashlib.sha256(data).hexdigest() != record['sha256']:
            raise ValueError(f'Original alterado: {record["original"]}')
        if not (folder / record['optimized']).is_file():
            raise FileNotFoundError(record['optimized'])

verify_originals(root)
verify_originals(root / 'site-html')
next_readme = (root / 'docs/NEXTJS.md').read_text()
next_readme = '# Grupo Vital — Next.js\n\n' + next_readme[next_readme.index('Portal institucional'):]
next_readme = next_readme.replace('(ASSETS.md)', '(docs/ASSETS.md)').replace('(VALIDATION.md)', '(docs/VALIDATION.md)')

with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    archive.write(root / 'docs/ENTREGA.md', prefix / 'LEIA-ME.md')
    for item in files(root / 'site-html'):
        archive.write(item, prefix / 'html-css-javascript' / item.relative_to(root / 'site-html'))
    for name in next_files:
        archive.write(root / name, prefix / 'nextjs' / name)
    for folder in next_dirs:
        for item in files(root / folder):
            archive.write(item, prefix / 'nextjs' / item.relative_to(root))
    for name in next_scripts:
        archive.write(root / 'scripts' / name, prefix / 'nextjs/scripts' / name)
    archive.writestr(str(prefix / 'nextjs/README.md'), next_readme)

with ZipFile(target) as archive:
    if archive.testzip() is not None:
        raise ValueError('Falha de integridade no ZIP conjunto.')
    print(f'{target}: {len(archive.namelist())} arquivos, {target.stat().st_size / 1024 / 1024:.2f} MiB. Duas versões completas.')
