# NFR Discord Bot

Egy Discord bot taglista és frakció jump funkciókkal.

## Funkciók

- **Taglista**: Megjeleníti a szerver taglistáját
- **Frakció Jump**: FiveM integráció (fejlesztés alatt)
- **Csatorna korlátozás**: A parancsokat csak egy adott csatornában lehet használni

## Telepítés

1. **Függőségek telepítése:**
```bash
npm install
```

2. **Bot token beállítása:**
   - Hozz létre egy `.env` fájlt a projekt gyökerében
   - Add hozzá a bot tokenjét:
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```

3. **Bot indítása:**
```bash
npm start
```

## Parancsok

- `!taglista` - Megjeleníti a szerver taglistáját
- `!frakciojump` - Frakció jump funkció (fejlesztés alatt)
- `!help` - Segítség menü

## Engedélyek

A botnak a következő Discord engedélyekre van szüksége:
- Üzenetek küldése
- Embed üzenetek küldése
- Szerver tagok megtekintése
- Üzenetek olvasása

## Konfiguráció

A `config.js` fájlban módosíthatod:
- Engedélyezett csatorna ID
- Parancs prefix
- Bot token

## Fejlesztés

A bot jelenleg fejlesztés alatt áll. A FiveM integráció hamarosan elérhető lesz. 