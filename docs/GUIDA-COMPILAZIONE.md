# Guida alla Compilazione del Foglio Google Sheets

## Premessa

Questa guida spiega come inserire e gestire i dati degli Internati Militari Italiani di Modica nel foglio Google Sheets che alimenta il sito web.

---

## Accesso al foglio

1. Apri il link del foglio Google Sheets condiviso
2. Assicurati di avere i permessi di modifica
3. Il foglio si chiama **IMI_Modica**

---

## Struttura delle colonne

| Colonna | Campo | Cosa inserire | Esempio |
|---------|-------|---------------|---------|
| A | **id** | Numero progressivo unico | `1`, `2`, `3`... |
| B | **cognome** | Cognome in MAIUSCOLO | `FERRARA` |
| C | **nome** | Nome proprio | `Giuseppe` |
| D | **data_nascita** | Formato GG/MM/AAAA | `15/03/1920` |
| E | **luogo_nascita** | Comune di nascita | `Modica` |
| F | **paternita** | Nome del padre | `fu Salvatore` |
| G | **maternita** | Nome della madre (con cognome da nubile) | `fu Maria Rossi` |
| H | **grado** | Grado militare | `Soldato`, `Caporale`, `Sergente` |
| I | **reparto** | Reparto/reggimento | `54° Regg. Fanteria` |
| J | **distretto_militare** | Distretto di appartenenza | `Ragusa` |
| K | **matricola** | Numero di matricola | `12345` |
| L | **campo_internamento** | Nome del campo/Lager | `Stalag XI-B Fallingbostel` |
| M | **data_cattura** | Data della cattura (GG/MM/AAAA) | `09/09/1943` |
| N | **luogo_cattura** | Dove è stato catturato | `Cefalonia` |
| O | **data_liberazione** | Data di liberazione (GG/MM/AAAA) | `08/05/1945` |
| P | **stato** | Esito finale | `Sopravvissuto`, `Deceduto`, `Disperso` |
| Q | **data_morte** | Solo se deceduto (GG/MM/AAAA) | `12/02/1944` |
| R | **causa_morte** | Solo se deceduto | `Malattia`, `Stenti` |
| S | **luogo_sepoltura** | Solo se noto | `Cimitero militare di...` |
| T | **decorazioni** | Onorificenze ricevute | `Croce al Merito di Guerra` |
| U | **note** | Informazioni aggiuntive | Testo libero |
| V | **foto_url** | Link foto da Google Drive | Vedi sezione sotto |
| W | **documenti_pdf_url** | Link PDF da Google Drive | Vedi sezione sotto |
| X | **fonti_archivistiche** | Dove hai trovato le informazioni | `AUSSME, Archivio Stato` |
| Y | **riferimenti_familiari** | Chi ha fornito informazioni | `Famiglia Ferrara` |
| Z | **pubblicato** | Mostra sul sito? | `TRUE` o `FALSE` |

---

## Regole importanti

### ID (colonna A)
- Ogni riga deve avere un numero **unico**
- Usa numeri progressivi: 1, 2, 3...
- **Non lasciare mai vuoto** e **non ripetere mai** lo stesso numero

### Stato (colonna P)
Usa **esattamente** una di queste tre parole:
- `Sopravvissuto` — tornato a casa
- `Deceduto` — morto durante l'internamento
- `Disperso` — sorte sconosciuta

### Date
- Usa **sempre** il formato `GG/MM/AAAA`
- Esempio corretto: `09/09/1943`
- Esempio sbagliato: ~~9 settembre 1943~~, ~~1943-09-09~~

### Pubblicato (colonna Z)
- Scrivi `TRUE` per rendere visibile il record sul sito
- Scrivi `FALSE` per tenerlo nascosto (utile per bozze incomplete)
- Se il campo è vuoto, il record **non** apparirà sul sito

---

## Come caricare foto su Google Drive

1. Apri **Google Drive**
2. Crea una cartella chiamata `IMI_Modica_Foto` (se non esiste)
3. Carica la foto nella cartella (formati accettati: JPG, PNG)
4. Fai **clic destro** sulla foto → **Condividi**
5. Clicca su **"Chiunque abbia il link"** e imposta su **"Visualizzatore"**
6. Copia il link (sarà tipo: `https://drive.google.com/file/d/XXXXX/view?usp=sharing`)
7. **Incolla il link** nella colonna V del foglio

### Per i PDF (documenti scansionati)
- Stessa procedura delle foto
- Se ci sono **più documenti** per lo stesso internato, separa i link con il **punto e virgola** (`;`)
- Esempio: `https://drive.google.com/file/d/AAA/view;https://drive.google.com/file/d/BBB/view`

---

## Consigli pratici

- **Salva spesso**: Google Sheets salva automaticamente, ma verifica
- **Non cancellare la riga 1**: contiene le intestazioni delle colonne
- **Non spostare le colonne**: il sito legge i dati in base alla posizione
- **Usa il filtro**: per controllare i dati, usa Dati → Crea un filtro
- **Usa la convalida dati**: per le colonne Stato (P) e Grado (H), puoi impostare un menu a tendina: Dati → Convalida dati → Elenco di elementi

---

## Verifica sul sito

Dopo aver inserito o modificato dei dati:
1. Aspetta **circa 30 minuti** (il sito ha una cache di 30 minuti)
2. Oppure apri il sito in una **finestra di navigazione in incognito** per forzare il caricamento dei nuovi dati
3. Verifica che il record appaia nella pagina **Ricerca**
4. Clicca sul record per verificare che tutti i dati siano corretti nella scheda individuale

---

## Problemi comuni

| Problema | Soluzione |
|----------|----------|
| Il record non appare sul sito | Controlla che la colonna Z (pubblicato) sia `TRUE` |
| La foto non si vede | Verifica che il link Drive sia condiviso come "Chiunque abbia il link" |
| La data appare strana | Usa il formato GG/MM/AAAA (con gli slash /) |
| Il badge esito non ha colore | Controlla l'ortografia esatta: `Sopravvissuto`, `Deceduto`, `Disperso` |

---

## Supporto

Per problemi tecnici con il sito, contatta il webmaster.
Per domande sui dati, rivolgiti al responsabile della ricerca.
