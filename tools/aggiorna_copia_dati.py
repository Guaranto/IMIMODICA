"""Aggiorna la copia di riserva dei dati (data/imi-modica.json).

Il sito legge i dati dal foglio Google; se Google non risponde (traffico alto,
foglio cancellato, chiave disattivata) usa questa copia.

Uso:
  1. Nel foglio Google: File -> Scarica -> Valori separati da virgola (.csv)
     (con la scheda IMI_Modica selezionata)
  2. python3 tools/aggiorna_copia_dati.py percorso/del/file.csv
  3. Commit e push.
"""
import csv, json, sys, os, datetime

src = sys.argv[1]
rows = list(csv.reader(open(src, encoding='utf-8-sig')))
rows = [r for r in rows if any(c.strip() for c in r)]
assert rows and rows[0][0].strip().lower() == 'id', 'La prima riga deve contenere le intestazioni (id, cognome, ...)'
out = {
    'aggiornato': datetime.date.today().isoformat(),
    'fonte': 'Copia del foglio Google IMI_Modica',
    'values': rows,
}
dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'imi-modica.json')
with open(dest, 'w', encoding='utf-8') as fh:
    json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))
print(f'Salvati {len(rows) - 1} record in data/imi-modica.json')
