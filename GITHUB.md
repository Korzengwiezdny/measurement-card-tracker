# Publikacja Measurement Card Tracker na GitHubie

Repozytorium ma gałąź `main` oraz tagi od `v0.1.0-alpha.1` do `v0.1.0-alpha.7`. Nie trzeba zakładać osobnego repozytorium dla każdej wersji. Ustalona nazwa repozytorium: `measurement-card-tracker`. Repozytorium publiczne; dane operacyjne pozostają lokalnie.

## Pierwsza publikacja

Utwórz na swoim koncie puste repozytorium, bez inicjalizowania README, licencji i .gitignore. W katalogu aplikacji wykonaj poniższe polecenia po zastąpieniu TWOJ_LOGIN:

```sh
git remote add origin https://github.com/TWOJ_LOGIN/measurement-card-tracker.git
git push -u origin main
git push origin 'refs/tags/v0.1.0-alpha.*'
```

Jeśli `origin` jest już ustawiony, sprawdź `git remote -v` przed jego zmianą. Uwierzytelniaj się przez obsługiwane logowanie GitHub; nie zapisuj tokenu w adresie repozytorium ani pliku projektu.

Na GitHubie w Releases utwórz osobne wydanie z każdego istniejącego tagu i oznacz je jako pre-release. Skopiuj opis danej wersji z CHANGELOG.md. Automatyczne archiwa kodu z tagów zawierają tylko pliki wersjonowane. Nie dołączaj lokalnego folderu aplikacji, baz, kopii ani starszych ZIP-ów o niesprawdzonej zawartości.

## Kolejna wersja

Pracuj na osobnej gałęzi, zapisz zmiany i sprawdź testy. Przed wydaniem uaktualnij VERSION, CHANGELOG.md i instrukcje. Po zaakceptowaniu zmian na main utwórz nowy tag; nie przestawiaj tagów opublikowanych wersji.

```sh
python test_app.py
git status --short
git diff --cached
git commit -m "Describe the change"
# Przykład dla następnego wydania:
git tag -a v0.1.0-alpha.8 -m "Maintenance 0.1.0-alpha.8"
git push origin main
git push origin v0.1.0-alpha.8
```

Przed każdym wysłaniem sprawdź `git ls-files`. `.gitignore` wyklucza lokalne dane, ale nie usuwa plików wcześniej dodanych do historii. Nie używaj `git add -f` dla danych. Konto i hasło utworzone w aplikacji pozostają w lokalnej bazie SQLite.
