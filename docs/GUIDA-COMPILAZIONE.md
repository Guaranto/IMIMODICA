# Guida alla Compilazione del Foglio Google Sheets

## Premessa

Questa guida spiega come inserire e gestire i dati degli Internati Militari Italiani di Modica nel foglio Google Sheets che alimenta il sito web.

---

## Accesso al foglio

1. Apri il link del foglio Google Sheets condiviso
2. Assicurati di avere i permessi di modifica
3. La scheda (linguetta in basso) si chiama **IMI_Modica**

---

## Struttura delle colonne

Il sito legge le colonne **in base al nome scritto nella riga 1**: non modificare le intestazioni.
Le colonne si possono anche spostare, ma il nome deve restare identico.

| Colonna | Campo | Cosa inserire | Esempio |
|---------|-------|---------------|---------|
| A | **id** | Numero progressivo unico | `1`, `2`, `3`... |
| B | **cognome** | Cognome | `Abate` |
| C | **nome** | Nome proprio | `Giorgio` |
| D | **data_nascita** | Formato GG/MM/AAAA | `09/02/1911` |
| E | **luogo_nascita** | Comune di nascita | `Modica` |
| F | **provincia** | Provincia di nascita | `Ragusa` |
| G | **regione** | Regione di nascita | `Sicilia` |
| H | **paternita** | Nome del padre (`fu` se defunto) | `fu Giovanni` |
| I | **maternita** | Nome della madre | `Concetta Battaglia` |
| J | **grado** | Grado militare | `Fante`, `Aviere`, `Sottotenente` |
| K | **reparto** | Reparto / Forze Armate | `4° Reg. Fanteria` |
| L | **distretto_militare** | Distretto (facoltativo) | `Siracusa` |
| M | **matricola** | Matricola del distretto militare | `18563 - SR` |
| N | **matricola_lager** | Numero di matricola nel lager | `174480` |
| O | **luogo_cattura** | Dove è stato catturato | `Fronte Greco` |
| P | **data_cattura** | Data della cattura | `09/09/1943` |
| Q | **campo_internamento** | Lager / luogo di internamento | `Stalag II B` |
| R | **data_liberazione** | Data di liberazione dal lager | `08/05/1945` |
| S | **forze_alleate** | Da chi è stato liberato | `Angloamericane`, `Armata Rossa` |
| T | **centro_alloggio** | Centro alloggio al rimpatrio | `Verona` |
| U | **data_rimpatrio** | Data del rimpatrio | `29/06/1945` |
| V | **stato** | Esito | `Reduce`, `Caduto`, `Disperso` |
| W | **data_morte** | Solo se caduto | `18/10/1943` |
| X | **causa_morte** | Solo se nota | `Malattia` |
| Y | **luogo_sepoltura** | Solo se noto | `Cimitero militare di...` |
| Z | **decorazioni** | Onorificenze ricevute | `Croce al Merito di Guerra` |
| AA | **memoria** | Sampietrino, progetti scolastici (più voci separate da `;`) | `Avo degli studenti della classe II A...` |
| AB | **note** | Informazioni aggiuntive | Testo libero |
| AC | **foto_url** | Foto (più foto separate da `;`, la prima è il ritratto) | `img/imi/49-bandiera-rosario-1.jpg` |
| AD | **documenti_pdf_url** | Link PDF da Google Drive | Vedi sezione sotto |
| AE | **fonti_archivistiche** | Fonti (separate da `;`) | `A.N.R.P. - LeBi; Arolsen Archives` |
| AF | **riferimenti_familiari** | Chi ha fornito informazioni | `Famiglia Abate` |
| AG | **pubblicato** | Mostra sul sito? | `TRUE` o `FALSE` |

---

## Regole importanti

### ID (colonna A)
- Ogni riga deve avere un numero **unico**
- Usa numeri progressivi: 1, 2, 3...
- **Non lasciare mai vuoto** e **non ripetere mai** lo stesso numero
- **Non rinumerare** le righe esistenti: l'ID è l'indirizzo della scheda sul sito

### Esito (colonna stato)
Usa **esattamente** una di queste tre parole:
- `Reduce` — tornato a casa
- `Caduto` — morto durante la prigionia/internamento
- `Disperso` — sorte sconosciuta

(Per compatibilità sono accettati anche `Sopravvissuto` e `Deceduto`.)

### Trattino e cella vuota
- `-` = dato cercato ma **non trovato** nelle fonti
- cella vuota = dato **non ancora ricercato**

### Date
- Usa il formato `GG/MM/AAAA`, ad esempio `09/09/1943`
- Se si conosce solo mese e anno, o solo l'anno: `09/1943` oppure `1944`

### Pubblicato
- Scrivi `TRUE` per rendere visibile il record sul sito
- Scrivi `FALSE` per tenerlo nascosto (utile per bozze incomplete)
- Se il campo è vuoto, il record **non** apparirà sul sito

---

## Foto

Le foto possono essere:
- **sul sito**, nella cartella `img/imi/` (le carica il webmaster): nella colonna si scrive il percorso, ad es. `img/imi/49-bandiera-rosario-1.jpg`
- **su Google Drive**: si incolla il link di condivisione (vedi sotto)

Se ci sono più foto per lo stesso internato, separale con `;`. La prima diventa il ritratto, le altre compaiono come miniature sotto.

### Come caricare foto su Google Drive

1. Apri **Google Drive**
2. Crea una cartella chiamata `IMI_Modica_Foto` (se non esiste)
3. Carica la foto nella cartella (formati accettati: JPG, PNG)
4. Fai **clic destro** sulla foto → **Condividi**
5. Clicca su **"Chiunque abbia il link"** e imposta su **"Visualizzatore"**
6. Copia il link (sarà tipo: `https://drive.google.com/file/d/XXXXX/view?usp=sharing`)
7. **Incolla il link** nella colonna foto_url

### Per i PDF (documenti scansionati)
- Stessa procedura delle foto
- Se ci sono **più documenti** per lo stesso internato, separa i link con il **punto e virgola** (`;`)

---

## Consigli pratici

- **Non cancellare la riga 1**: contiene le intestazioni delle colonne
- **Imposta le colonne come testo** (Formato → Numero → Testo normale), così Google non trasforma le date
- **Usa il filtro**: per controllare i dati, usa Dati → Crea un filtro
- **Usa la convalida dati**: per la colonna stato puoi impostare un menu a tendina: Dati → Convalida dati → Elenco di elementi (`Reduce,Caduto,Disperso`)

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
| Il record non appare sul sito | Controlla che la colonna pubblicato sia `TRUE` |
| La foto non si vede | Verifica il percorso `img/imi/...` o che il link Drive sia condiviso come "Chiunque abbia il link" |
| La data appare strana | Usa il formato GG/MM/AAAA (con gli slash /) e imposta la colonna come testo |
| Il badge esito non ha colore | Controlla l'ortografia esatta: `Reduce`, `Caduto`, `Disperso` |
| Un campo non compare | Controlla che l'intestazione della colonna sia scritta esattamente come in questa guida |

---

## Supporto

Per problemi tecnici con il sito, contatta il webmaster.
Per domande sui dati, rivolgiti al responsabile della ricerca.
