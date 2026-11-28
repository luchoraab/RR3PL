"""Render static tariffs from motors/tarifas.json. Use --check in CI."""
import json
import re
import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "motors"
catalog = json.loads((ROOT / "tarifas.json").read_text())
page = ROOT / "index.html"
original = page.read_text()
html = original


def pesos(amount):
    return f"${amount:,}".replace(",", ".")


def card_rate(turn, amounts):
    if len(amounts) == 2:
        weekdays, weekend = map(pesos, amounts)
        body = (f"<dl><div><dt>Lunes a jueves</dt><dd>{weekdays}</dd></div>"
                f"<div><dt>Viernes a domingo</dt><dd>{weekend}</dd></div></dl>")
    elif amounts:
        body = f"<strong>{pesos(amounts[0])}</strong><span>Lunes a domingo</span>"
    else:
        body = "<span>Consultar precio</span>"
    return (f'<div class="rate" data-turn="{turn} horas"'
            f' data-prices="{",".join(map(str, amounts))}">'
            f"<small>{turn} HORAS</small>{body}</div>")


def table_cell(amounts):
    if len(amounts) == 2:
        return " / ".join(map(pesos, amounts)) + "  Lun–Jue / Vie–Dom"
    if amounts:
        return pesos(amounts[0]) + "  Lunes a domingo"
    return "Consultar disponibilidad y precio"


def replace_once(pattern, replacement, source):
    result, count = re.subn(pattern, replacement, source, flags=re.S)
    if count != 1:
        raise SystemExit(f"Se esperaba una coincidencia para {pattern!r}: {count}")
    return result


rows = []
options = []
for car in catalog:
    key = re.escape(car["id"])
    name = escape(car["name"])
    tariffs = [car["rates"][turn] for turn in ("12", "24")]
    rates = "".join(card_rate(turn, amounts) for turn, amounts in zip(("12", "24"), tariffs))
    html = replace_once(
        rf'(<article class="vehicle-card" id="{key}"[^>]*>.*?<div class="rates">).*?(</div>\s*<button)',
        lambda match: match[1] + rates + match[2], html,
    )
    cells = "".join(f"<td>{table_cell(amounts)}</td>" for amounts in tariffs)
    rows.append(f'<tr><th scope="row"><a href="#{car["id"]}">{name}</a></th>{cells}</tr>')
    options.append(f"<option>{name}</option>")

html = replace_once(r"<tbody>.*?</tbody>", lambda _: "<tbody>\n" + "\n".join(rows) + "\n        </tbody>", html)
html = replace_once(
    r'(<select name="vehiculo" id="vehiculo"><option value="">[^<]+</option>).*?(</select>)',
    lambda match: match[1] + "".join(options) + match[2], html,
)
if "--check" in sys.argv:
    if original != html:
        raise SystemExit("Tarifas desactualizadas. Ejecutá python scripts/update-fleet.py.")
else:
    page.write_text(html)
