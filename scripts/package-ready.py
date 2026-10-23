"""Entrega única do site pronto: index.html na raiz do ZIP, sem escolha de versões."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

root = Path(__file__).resolve().parent.parent
source = root / 'site-html'
target = root / 'dist/grupo-vital-site-pronto.zip'
target.parent.mkdir(exist_ok=True)

required = ['index.html', 'forca-vital/index.html', 'ct-general/index.html',
            'vital-beach/index.html', 'assets/css/styles.css',
            'assets/js/config.js', 'assets/js/main.js',
            'assets/js/schedule.js', 'assets/css/schedule.css']
for name in required:
    if not (source / name).is_file():
        raise FileNotFoundError(name)

records = json.loads((source / 'public/images/asset-records.json').read_text())
if len(records) != 6:
    raise ValueError('Os seis arquivos oficiais são obrigatórios.')
for record in records:
    if hashlib.sha256((source / record['original']).read_bytes()).hexdigest() != record['sha256']:
        raise ValueError(f'Original alterado: {record["original"]}')
    if not (source / record['optimized']).is_file():
        raise FileNotFoundError(record['optimized'])

with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for item in sorted(source.rglob('*')):
        if item.is_file() and not item.is_symlink() and item.name not in {'.DS_Store', '.gitkeep'}:
            archive.write(item, item.relative_to(source))

with ZipFile(target) as archive:
    if archive.testzip() is not None:
        raise ValueError('ZIP inválido.')
    if 'index.html' not in archive.namelist():
        raise ValueError('A entrada do site precisa estar na raiz.')
    print(f'{target}: {len(archive.namelist())} arquivos; {target.stat().st_size / 1024 / 1024:.2f} MiB. Site único com index.html na raiz.')
