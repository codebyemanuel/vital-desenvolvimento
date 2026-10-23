"""Gera um ZIP reproduzível sem Git, dependências, builds, segredos ou resultados de testes."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
target = root / 'dist' / 'grupo-vital-premium.zip'
target.parent.mkdir(exist_ok=True)
excluded_dirs = {'.git', 'node_modules', '.next', 'out', 'dist', 'downloads', 'test-results', 'playwright-report', '__pycache__'}
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for item in sorted(root.rglob('*')):
        relative = item.relative_to(root)
        if not item.is_file() or item.is_symlink() or any(part in excluded_dirs for part in relative.parts):
            continue
        if (item.name.startswith('.env') and item.name != '.env.example') or item.name.endswith(('.log', '.tsbuildinfo')):
            continue
        archive.write(item, Path('grupo-vital-premium') / relative)
print(target)
