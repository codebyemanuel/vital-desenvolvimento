"""Converte o HTML validado do projeto em páginas independentes de Next/React.

Ferramenta de manutenção: requer Python+lxml e um build Next existente.
O site gerado não depende de Python, Node, React, npm ou compilação.
Preserva assets/js/main.js e a configuração já editada se executado novamente.
"""
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote
from lxml import html, etree
import shutil
import re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'site-html'
SLUGS = ['forca-vital', 'ct-general', 'vital-beach']
SOCIALS = {
    'https://www.instagram.com/forcavitalfitness_/': 'forca-vital',
    'https://www.instagram.com/ct.general/': 'ct-general',
    'https://www.instagram.com/vitalbeach_/': 'vital-beach',
}
OUT.mkdir(exist_ok=True)
for folder in ['assets/css', 'assets/js', 'assets/fonts', 'assets/vendor', 'licenses']:
    (OUT / folder).mkdir(parents=True, exist_ok=True)
for name in ['images', 'logos']:
    shutil.copytree(ROOT / 'public' / name, OUT / 'public' / name, dirs_exist_ok=True)
shutil.copyfile(ROOT / 'src/app/icon.svg', OUT / 'favicon.svg')

for name in ['gsap.min.js', 'ScrollTrigger.min.js']:
    # Evita referências de sourcemaps a arquivos que não fazem parte da entrega.
    content = (ROOT / 'node_modules/gsap/dist' / name).read_text()
    content = re.sub(r'//# sourceMappingURL=.*', '', content)
    content = '\n'.join(line.rstrip() for line in content.splitlines()).rstrip() + '\n'
    (OUT / 'assets/vendor' / name).write_text(content)

font_css = []
for package, files in [
    ('@fontsource/barlow-condensed', ['latin-600.css', 'latin-700.css']),
    ('@fontsource-variable/manrope', ['index.css']),
]:
    for name in files:
        source = (ROOT / 'node_modules' / package / name).read_text()
        # O projeto está em português: subsets Latin e Latin Extended.
        blocks = re.findall(r'/\* ([^*]+) \*/\s*(@font-face\s*\{.*?\})', source, re.S)
        for label, block in blocks:
            if 'latin-' not in label and 'latin-ext-' not in label:
                continue
            for font in re.findall(r'url\(\./files/([^)]+)\)', block):
                shutil.copyfile(ROOT / 'node_modules' / package / 'files' / font, OUT / 'assets/fonts' / font)
            font_css.append(block.replace('./files/', '../fonts/'))
    license_file = ROOT / 'node_modules' / package / 'LICENSE'
    if license_file.exists():
        shutil.copyfile(license_file, OUT / 'licenses' / (package.split('/')[-1] + '.txt'))
shutil.copyfile(ROOT / 'node_modules/lucide-react/LICENSE', OUT / 'licenses/lucide.txt')
(OUT / 'licenses/GSAP.txt').write_text(
    'GSAP e ScrollTrigger, versão 3.15.0, Copyright GreenSock.\n'
    'Distribuídos segundo a licença padrão GSAP: https://gsap.com/standard-license/\n'
    'Os cabeçalhos originais de licença estão preservados em assets/vendor/.\n'
)

css = (ROOT / 'src/app/globals.css').read_text()
css = re.sub(r'@import "tailwindcss";\s*', '', css)
css = re.sub(r'@theme inline\s*\{[^}]*\}\s*', '', css)
preflight = '''
/* CSS nativo: nenhuma etapa de compilação é necessária. */
svg { display: inline-block; vertical-align: middle; flex-shrink: 0; }
img { display: block; }
button { background: none; }
[hidden] { display: none !important; }
.absolute-photo, .lightbox-photo { position: absolute; inset: 0; width: 100%; height: 100%; }
.lightbox-photo { object-fit: contain; }
'''
css = '\n\n'.join(font_css) + '\n' + preflight + css
(OUT / 'assets/css/styles.css').write_text(css)

routes = [('index.html', 'index.html', None), ('_not-found.html', '404.html', None)]
routes += [(slug + '.html', slug + '/index.html', slug) for slug in SLUGS]
for source, target, slug in routes:
    tree = html.fromstring((ROOT / '.next/server/app' / source).read_text())
    prefix = '../' if slug else './'
    head, body = tree.find('head'), tree.find('body')
    body.set('data-page', slug or ('404' if target == '404.html' else 'home'))
    for element in tree.xpath('//script | //link | //style | //meta[@name="next-size-adjust"]'):
        element.getparent().remove(element)
    for comment in tree.xpath('//comment()'):
        # React intercala comentários entre trechos de texto. Preserve o tail.
        comment.drop_tree()
    for element in tree.xpath('//*[@hidden]'):
        if not element.text_content().strip():
            element.getparent().remove(element)

    for anchor in tree.xpath('//a[@href]'):
        value = anchor.get('href')
        if value in SOCIALS and anchor.xpath('ancestor::footer'):
            anchor.set('data-unit-social', SOCIALS[value])
        path, _, fragment = value.partition('#')
        if path == '/':
            anchor.set('href', prefix + 'index.html' + ('#' + fragment if fragment else ''))
        elif path.lstrip('/') in SLUGS:
            unit = path.lstrip('/')
            anchor.set('href', prefix + unit + '/index.html' + ('#' + fragment if fragment else ''))
            anchor.set('data-unit-link', unit)
    for image in tree.xpath('//img'):
        source_url = image.get('src', '')
        if '/_next/image?' in source_url:
            source_url = parse_qs(urlparse(source_url).query)['url'][0]
        source_url = unquote(source_url)
        image.set('src', prefix + 'public/' + source_url.lstrip('/'))
        for attr in ['srcset', 'data-nimg']:
            image.attrib.pop(attr, None)
        for unit in SLUGS:
            if '/' + unit + '/' in source_url:
                image.set('data-logo' if '/logos/' in source_url else 'data-photo', unit)
    for card in tree.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," experience-card ")]'):
        card.set('data-unit', card.get('data-unit-link'))
    menu = tree.xpath('//*[@id="mobile-menu"]')[0]
    menu.set('inert', '')
    for unit in SLUGS:
        for item in menu.xpath('.//a[@data-unit-link="' + unit + '"]'):
            if unit == slug:
                item.set('aria-current', 'page')

    for attrs in [
        {'rel': 'icon', 'href': prefix + 'favicon.svg', 'type': 'image/svg+xml'},
        {'rel': 'stylesheet', 'href': prefix + 'assets/css/styles.css'},
    ]:
        etree.SubElement(head, 'link', attrib=attrs)
    for filename in ['assets/js/config.js', 'assets/vendor/gsap.min.js', 'assets/vendor/ScrollTrigger.min.js', 'assets/js/main.js']:
        etree.SubElement(head, 'script', attrib={'src': prefix + filename, 'defer': 'defer'})
    # HTML completo e sem hidratação: texto e navegação existem mesmo sem JS.
    etree.indent(tree, space='  ')
    destination = OUT / target
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text('<!DOCTYPE html>\n' + html.tostring(tree, encoding='unicode', method='html') + '\n')

(OUT / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
(OUT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n')
print('HTML, CSS, bibliotecas e arquivos oficiais exportados para', OUT)
