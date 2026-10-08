import datetime, sqlite3
from pathlib import Path
root=Path(__file__).resolve().parent
folder=root/'backups';folder.mkdir(exist_ok=True)
target=folder/('maintenance-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S')+'.sqlite3')
if not (root/'data'/'maintenance.sqlite3').exists():raise SystemExit('Brak bazy do skopiowania.')
with sqlite3.connect(root/'data'/'maintenance.sqlite3') as source,sqlite3.connect(target) as dest:source.backup(dest)
print('Zapisano kopię:',target)
