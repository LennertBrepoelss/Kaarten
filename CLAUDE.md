# Kaarten (Kaartavond-app)

- Pas alleen `bron/troeven-boom.html` aan (en eventueel `bron/updater.js` of `bron/sw.js`).
- Bouw daarna met `python3 bron/build.py`: dat schrijft `index.html`, `sw.js` en een nieuwe `version.json` in de hoofdmap.
  Een nieuwe `version.json` zorgt dat de geïnstalleerde app op de telefoon zichzelf ververst.
- De app draait op GitHub Pages (branch `main`, map `/`). Gegevens staan alleen in localStorage op de telefoon.
- Teksten in de app zijn in het Vlaams-Nederlands.
