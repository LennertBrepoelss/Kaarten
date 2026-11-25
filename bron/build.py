"""Bouwt app/index.html (GitHub Pages, installeerbaar) uit troeven-boom.html en zet een nieuwe versie."""
import json, time, pathlib
root = pathlib.Path(__file__).parent
src = (root / 'troeven-boom.html').read_text(encoding='utf8')
v = time.strftime('%Y%m%d-%H%M%S')
head_extra = ('<link rel="manifest" href="manifest.webmanifest">'
              '<link rel="icon" href="icon-192.png">'
              '<link rel="apple-touch-icon" href="icon-180.png">'
              '<meta name="apple-mobile-web-app-capable" content="yes">'
              '<meta name="mobile-web-app-capable" content="yes">'
              '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
              '<meta name="apple-mobile-web-app-title" content="Kaartavond">')
assert src.count('</head>') == 1
out = src.replace('</head>', head_extra + '</head>')
updater = (root / 'updater.js').read_text(encoding='utf8').replace('__VERSION__', v)
assert out.rstrip().endswith('</body></html>')
out = out.rstrip()[:-len('</body></html>')] + '<script>\n' + updater + '\n</script>\n</body></html>\n'
(root / 'app' / 'index.html').write_text(out, encoding='utf8')
(root / 'app' / 'version.json').write_text(json.dumps({'v': v}) + '\n', encoding='utf8')
sw = (root / 'sw.js').read_text(encoding='utf8').replace('__VERSION__', v)
(root / 'app' / 'sw.js').write_text(sw, encoding='utf8')
print('versie', v)
