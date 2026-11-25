"""Aggiorna la copia di riserva dei dati (data/imi-modica.json).

Il sito legge i dati dal foglio Google; se Google non risponde (traffico alto,
foglio cancellato, chiave disattivata) usa questa copia.

La copia si aggiorna da sola ogni ora tramite GitHub Actions
(.github/workflows/aggiorna-copia-dati.yml). Si può anche lanciare a mano:

  python3 tools/aggiorna_copia_dati.py              # scarica dal foglio Google
  python3 tools/aggiorna_copia_dati.py file.csv     # da un CSV scaricato

Il file viene riscritto solo se i dati sono cambiati.
"""
import csv, io, json, os, sys, datetime, urllib.request

SPREADSHEET_ID = '1HtJAejUHxWE0GKJOBghq2lK_70xKvEP08COpbW9Jf3o'
EXPORT_URL = f'https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv'  # prima scheda: IMI_Modica
DEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'imi-modica.json')
MIN_RECORD = 400  # protezione: non sovrascrivere la copia con un foglio svuotato per errore


def leggi(sorgente):
    if sorgente:
        testo = open(sorgente, encoding='utf-8-sig').read()
    else:
        with urllib.request.urlopen(EXPORT_URL, timeout=60) as r:
            testo = r.read().decode('utf-8-sig')
    rows = [r for r in csv.reader(io.StringIO(testo)) if any(c.strip() for c in r)]
    if not rows or rows[0][0].strip().lower() != 'id' or 'cognome' not in [c.strip().lower() for c in rows[0]]:
        sys.exit('ERRORE: la prima riga non contiene le intestazioni attese (id, cognome, ...). '
                 'La scheda IMI_Modica deve essere la prima del foglio.')
    if len(rows) - 1 < MIN_RECORD:
        sys.exit(f'ERRORE: solo {len(rows) - 1} record (minimo {MIN_RECORD}): copia NON aggiornata.')
    return rows


def main():
    rows = leggi(sys.argv[1] if len(sys.argv) > 1 else None)
    try:
        attuale = json.load(open(DEST, encoding='utf-8')).get('values')
    except (OSError, ValueError):
        attuale = None
    if attuale == rows:
        print(f'Nessuna modifica ({len(rows) - 1} record).')
        return
    out = {
        'aggiornato': datetime.date.today().isoformat(),
        'fonte': 'Copia del foglio Google IMI_Modica',
        'values': rows,
    }
    with open(DEST, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'Copia aggiornata: {len(rows) - 1} record.')


if __name__ == '__main__':
    main()
