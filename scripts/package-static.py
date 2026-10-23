"""Empacota a versão HTML/CSS/JS, sem depender de Node, Next ou bibliotecas Python."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

root = Path(__file__).resolve().parent.parent
source = root / 'site-html'
target = root / 'dist' / 'grupo-vital-html-css-javascript.zip'
target.parent.mkdir(exist_ok=True)

required = ['index.html', 'forca-vital/index.html', 'ct-general/index.html',
            'vital-beach/index.html', '404.html', 'assets/css/styles.css',
            'assets/js/config.js', 'assets/js/main.js', 'README.md',
            'assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js',
            'assets/js/schedule.js', 'assets/css/schedule.css']
for name in required:
    if not (source / name).is_file():
        raise FileNotFoundError(name)

records = json.loads((source / 'public/images/asset-records.json').read_text())
if len(records) != 6:
    raise ValueError('Esperados seis registros de arquivos oficiais.')
for record in records:
    original = source / record['original']
    optimized = source / record['optimized']
    if hashlib.sha256(original.read_bytes()).hexdigest() != record['sha256']:
        raise ValueError(f'Original alterado: {original}')
    if not optimized.is_file() or optimized.stat().st_size == 0:
        raise ValueError(f'Cópia otimizada ausente: {optimized}')

with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for item in sorted(source.rglob('*')):
        if not item.is_file() or item.is_symlink() or item.name in {'.DS_Store', '.gitkeep'}:
            continue
        archive.write(item, Path('grupo-vital-premium') / item.relative_to(source))

with ZipFile(target) as archive:
    if archive.testzip() is not None:
        raise ValueError('Falha na integridade do ZIP.')
    print(f'{target}: {len(archive.namelist())} arquivos, {target.stat().st_size / 1024 / 1024:.2f} MiB. Seis originais íntegros.')
