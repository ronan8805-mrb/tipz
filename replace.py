import glob
old = '<a href="index.html" class="logo-text">Diz<span>Tipz</span></a>'
new = '<a href="index.html" class="logo"><img src="Screenshot_2026-05-10_183738-removebg-preview.png" alt="DizTipz" style="height: 45px; width: auto; object-fit: contain; vertical-align: middle;"></a>'
for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if old in content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content.replace(old, new))
        print('Updated', f)
