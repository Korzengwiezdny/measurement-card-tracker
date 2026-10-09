# Maintenance — rejestr kart pomiarowych

Wersja **0.1.0-alpha.7**, przeznaczona do prób i lokalnej pracy na komputerze administratora. Python 3.11+, SQLite, openpyxl; interfejs w języku polskim.

## Funkcje

- Spis kart, wyposażenie ATE, tworzenie pustych stanowisk, wyszukiwanie i eksport Excel.
- Podmiana zgodnych modeli z fizycznymi potwierdzeniami, atomową zmianą obu lokalizacji i historią.
- Identyfikacja po S/N; MU jest opcjonalny. Kilka S/N połączonych `+` opisuje jedną kartę.
- Dodanie zakupu, wycofanie do archiwum, rozbieżności na stanowisku.
- Przenoszenie oraz powroty z kalibracji i naprawy.
- Słownik lokalizacji, filtry historii, szkic podmiany, skaner S/N działający jak klawiatura.
- Konta administratora, technika i odczytu; dzienne i ręczne kopie bazy.

- Stan magazynowy i braki zapasu według modelu oraz stanowiska.

## Czysta instalacja z Git

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe server.py
```

Otwórz http://127.0.0.1:8765/. Przy pierwszym uruchomieniu utwórz administratora z własnym hasłem (minimum 12 znaków). Repozytorium nie zawiera kont ani bazy. Import początkowy wymaga skoroszytu w układzie Maintenance opisanym w [START.md](START.md).

Na komputerze z gotowym Pythonem i zależnościami można korzystać z `Uruchom.cmd`. Domyślne nasłuchiwanie jest tylko na localhost. Wdrożenie sieciowe wymaga osobnego przygotowania.

## Testy

```powershell
.\.venv\Scripts\python.exe test_app.py
```

43 testy automatycznych. Testy korzystają z tymczasowej, syntetycznej bazy i nie zmieniają używanego spisu. Interfejs dodatkowo sprawdzono na oddzielnej bazie testowej; fizyczny czytnik wymaga próby na stanowisku.

## Dane i aktualizacje

Baza, hasła kont, kopie zapasowe, pliki Excel i lokalne analizy nie są wersjonowane. Git przechowuje kod i instrukcje; historia operacji na kartach pozostaje w SQLite. Kopia kodu nie zastępuje kopii danych. Nie dodawaj ignorowanych plików poleceniem `git add -f`.

Przed aktualizacją wykonaj kopię bazy i zatrzymaj serwer. Zachowaj foldery `data` i `backups`. Wersja alfa nie stanowi potwierdzenia gotowości do udostępnienia w sieci firmowej. Import nie scala konkurencyjnych baz; eksport Excel jest migawką, bez automatycznej synchronizacji SharePoint.

## Wersjonowanie

Plik `VERSION` określa wersję wydania. Pierwszy tag to `v0.1.0-alpha.1`. Kolejne wersje próbne: `0.1.0-alpha.2` itd. Zmiany zapisuj w [CHANGELOG.md](CHANGELOG.md). Repozytorium można przesłać do wybranego zdalnego serwera Git po skonfigurowaniu jego adresu.
