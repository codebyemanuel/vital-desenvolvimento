"""Atualiza a grade HTML inicial a partir de config.js, preservando o restante do site."""
from pathlib import Path
from html import escape
from lxml import html, etree
import json

root = Path(__file__).resolve().parent.parent
site = root / 'site-html'
text = (site / 'assets/js/config.js').read_text()
data = json.loads(text.split('window.VITAL_CONFIG = ', 1)[1].strip().removesuffix(';'))
units = data['units']
days = [('segunda', 'Segunda-feira'), ('terca', 'Terça-feira'), ('quarta', 'Quarta-feira'),
        ('quinta', 'Quinta-feira'), ('sexta', 'Sexta-feira'), ('sabado', 'Sábado'), ('domingo', 'Domingo')]
periods = [('manha', 'Manhã'), ('tarde', 'Tarde'), ('noite', 'Noite')]

def initial_grid(unit):
    entries = unit.get('activitySchedule', [])
    if not entries:
        return f'''<div class="schedule-empty"><span class="eyebrow">{escape(unit['name'])}</span>
        <h3>PROGRAMAÇÃO A CONFIRMAR.</h3><p>Os horários das atividades desta unidade ainda não foram informados. Fale com a equipe para conhecer a programação.</p></div>'''
    result = []
    for index, (day, label) in enumerate(days, 1):
        slots = [e for e in entries if e['day'] == day]
        if not slots:
            continue
        result.append(f'''<section class="schedule-day" data-schedule-day="{day}" aria-labelledby="horarios-{day}">
          <div class="schedule-day-header"><span class="schedule-day-index" aria-hidden="true">{index:02}</span>
          <h3 id="horarios-{day}">{label}</h3><span class="schedule-day-count">{len(slots)} opções</span></div>''')
        for period, period_label in periods:
            rows = sorted([e for e in slots if e['period'] == period], key=lambda e: e['start'])
            if not rows:
                continue
            result.append(f'<div class="schedule-period"><h4>{period_label}</h4><ul class="schedule-list">')
            for row in rows:
                start = escape(row['start'])
                end = row.get('end')
                end_attr = f' data-end="{escape(end)}"' if end else ''
                modality_attr = f' data-modality="{escape(row["modality"])}"' if row.get('modality') else ''
                kind_attr = f' data-kind="{escape(row["kind"])}"' if row.get('kind') else ''
                result.append(f'''<li class="schedule-slot" data-activity="{escape(row['activity'])}" data-start="{start}" data-period="{period}"{end_attr}{modality_attr}{kind_attr}>
                <span class="schedule-time"><time datetime="{start}">{start}</time>''')
                if end:
                    result.append(f'<span class="schedule-time-separator">às</span><time datetime="{escape(end)}">{escape(end)}</time>')
                label = f'<span class="schedule-activity-name">{escape(row["activity"])}</span>'
                if row.get('modality') and len(set(e.get('modality') for e in entries)) > 1:
                    label += f'<small class="schedule-modality-tag">{"Funcional" if row["modality"] == "funcional" else "Futevôlei"}</small>'
                result.append(f'</span><span class="schedule-activity">{label}</span></li>')
            result.append('</ul></div>')
        result.append('</section>')
    return ''.join(result)

def markup(selected):
    tabs = ''.join(f'''<button type="button" class="schedule-tab" role="tab" id="schedule-tab-{unit['slug']}"
      data-schedule-unit="{unit['slug']}" aria-controls="schedule-panel" aria-selected="{str(unit == selected).lower()}"
      tabindex="{0 if unit == selected else -1}" style="--unit-color:{unit['color']}">{escape(unit['name'])}</button>''' for unit in units)
    day_options = ''.join(f'<option value="{key}">{label}</option>' for key, label in days)
    entries = selected.get('activitySchedule', [])
    hidden = ' hidden' if not entries else ''
    count = len(entries)
    day_count = len(set(e['day'] for e in entries))
    status = f'{selected["name"]} · {count} horários em {day_count} {"dia" if day_count == 1 else "dias"}' if entries else f'{selected["name"]} · programação a confirmar'
    note = selected.get('activityScheduleNote', '')
    return f'''<section class="section activity-schedule" id="horarios" aria-labelledby="schedule-title" data-activity-schedule data-initial-unit="{selected['slug']}" style="--accent:{selected['color']}">
      <div class="section-heading schedule-heading" data-reveal>
        <div><p class="eyebrow">SUA ROTINA EM MOVIMENTO</p><h2 id="schedule-title">SEU TREINO.<br><span>NA HORA CERTA.</span></h2></div>
        <p class="section-description">Encontre seu ritmo. Escolha a unidade e veja os horários das atividades.</p>
      </div>
      <div class="schedule-tabs" role="tablist" aria-label="Unidade da programação">{tabs}</div>
      <div class="schedule-panel" id="schedule-panel" role="tabpanel" aria-labelledby="schedule-tab-{selected['slug']}" tabindex="0">
        <div class="schedule-controls">
          <div class="schedule-filters"{hidden}>
            <div class="schedule-filter"><label for="schedule-day">Dia da semana</label><select id="schedule-day" name="schedule-day"><option value="todos">Todos os dias</option>{day_options}</select></div>
            <div class="schedule-filter"><label for="schedule-period">Período</label><select id="schedule-period" name="schedule-period"><option value="todos">Todos os períodos</option><option value="manha">Manhã</option><option value="tarde">Tarde</option><option value="noite">Noite</option></select></div>
            <div class="schedule-filter" data-modality-filter hidden><label for="schedule-modality">Modalidade</label><select id="schedule-modality" name="schedule-modality"><option value="todas">Todas as modalidades</option></select></div>
          </div>
          <a class="schedule-contact" href="{escape(selected['instagram'])}" target="_blank" rel="noopener noreferrer">Consultar {escape(selected['name'])}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"></path></svg></a>
        </div>
        <p class="schedule-status" role="status" aria-live="polite" aria-atomic="true">{escape(status)}</p>
        <div class="schedule-grid" data-day-count="{day_count}">{initial_grid(selected)}</div>
        <p class="schedule-note"{' hidden' if not note else ''}>{escape(note)}</p>
        <p class="schedule-footer">Confirme vagas e eventuais alterações de horários diretamente com a unidade.</p>
      </div>
    </section>'''

for page in site.rglob('*.html'):
    tree = html.fromstring(page.read_text())
    body = tree.find('body')
    current = body.get('data-page')
    prefix = '../' if current in {unit['slug'] for unit in units} else './'
    has_schedule = current != '404'
    destination = '#horarios' if has_schedule else './index.html#horarios'
    for nav in tree.xpath('//nav[contains(@class,"desktop-nav")] | //*[@id="mobile-menu"]/nav'):
        for existing in nav.xpath('./a[@data-schedule-nav]'):
            existing.getparent().remove(existing)
        link = etree.Element('a', href=destination)
        link.set('data-schedule-nav', '')
        link.text = 'Horários'
        if nav.get('aria-label') == 'Navegação móvel':
            link.set('class', 'mobile-about mobile-schedule')
            about = nav.xpath('./a[contains(@class,"mobile-about")]')
            if about:
                nav.insert(nav.index(about[0]), link)
            else:
                nav.append(link)
        else:
            nav.insert(1, link)
    for existing in tree.xpath('//*[@data-activity-schedule]'):
        existing.getparent().remove(existing)
    if has_schedule:
        selected = next((unit for unit in units if unit['slug'] == current), units[0])
        section = html.fromstring(markup(selected))
        target = tree.xpath('//*[@id="contato"]' if current != 'home' else '//*[@id="espacos"]')[0]
        target.getparent().insert(target.getparent().index(target), section)
        head = tree.find('head')
        if not head.xpath('./link[contains(@href,"schedule.css")]'):
            etree.SubElement(head, 'link', rel='stylesheet', href=prefix + 'assets/css/schedule.css')
        if not head.xpath('./script[contains(@src,"schedule.js")]'):
            script = etree.Element('script', src=prefix + 'assets/js/schedule.js', defer='defer')
            main = head.xpath('./script[contains(@src,"main.js")]')[0]
            head.insert(head.index(main), script)
        details = tree.xpath('//*[contains(@class,"visit-details")]/div[1]')
        if details and selected.get('activitySchedule'):
            box = details[0]
            heading = box.find('h3')
            for child in list(box):
                if child is not heading:
                    box.remove(child)
            heading.text = 'HORÁRIOS DAS ATIVIDADES'
            etree.SubElement(box, 'p').text = 'Confira a grade completa das atividades.'
            etree.SubElement(box, 'a', href='#horarios', attrib={'class': 'activity-schedule-link'}).text = 'VER PROGRAMAÇÃO'
    etree.indent(tree, space='  ')
    page.write_text('<!DOCTYPE html>\n' + html.tostring(tree, encoding='unicode', method='html') + '\n')

print('Aba Horários e grades iniciais sincronizadas nas quatro páginas.')
