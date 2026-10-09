# 0.1.0-alpha.7 — 2026-10-09

- Plan kalibracji: ręczne listy kart i import XLSX po nagłówkach MU/SN.
- Jawne rozstrzyganie wielu dopasowań, brak dopasowania widoczny w podglądzie.
- Aktualne lokalizacje, wykrywanie podmian i powrotów z historii oraz uwzględnianie cofnięć.
- Zamknięcie lub anulowanie z opisem i autorem; ochrona przed powieleniem otwartego zlecenia.
- Plany są archiwizowane razem z bazą przy tworzeniu nowego spisu.

# 0.1.0-alpha.6 — 2026-10-09

- Nowy aktywny spis z Excela Maintenance: podgląd, potwierdzenie, pełne archiwum poprzedniej bazy i zachowanie kont.
- Kontrola zmian od podglądu do zatwierdzenia, atomowy zapis.

# 0.1.0-alpha.5 — 2026-10-09

- Spójny, stonowany wygląd wszystkich ekranów, formularzy i okien dialogowych.
- Czytelniejsze tabele, kontrast opisów, przewijana nawigacja na telefonie i widoczny fokus klawiatury.

# 0.1.0-alpha.4 — 2026-10-09

- Weryfikacja i korekta stanu zastanego dostępna bez podmiany ze spisu i wyposażenia ATE.
- Osobny wybór: edycja tej samej karty lub inna fizyczna karta. Historia i blokady wersji pozostają zachowane.
- Wspólny filtr magazynu obejmujący wszystkie wskazane półki.

# Historia wersji

## 0.1.0-alpha.3 — 2026-10-09

- Stan magazynowy według modelu i ocena zapasu dla każdego ATE/SATE/VATE.
- Wspólny zapas: minimum jedna sprawna karta bez blokad identyfikacji.
- Szczegóły kart magazynowych i powody wykluczenia z zapasu.
- Konfigurowalne lokalizacje magazynowe, wyszukiwanie i filtr braków.
- 37 testów, w tym wiele S/N jednej karty, duplikaty i wspólny zapas.

## 0.1.0-alpha.2 — 2026-10-08

- Administrator może dodać puste ATE, SATE lub VATE z przypisaną halą.
- Puste stanowiska są widoczne w przeglądzie i liście stanowisk.
- Dodawanie karty z widoku stanowiska wypełnia lokalizację i halę.
- Normalizacja nazwy i blokada duplikatów niezależnie od hali.
- Dodanie stanowiska zapisuje autora, datę i nazwę w historii.
- 34 testy oraz próba dodania pustego stanowiska i pierwszej karty na kopii bazy.

## 0.1.0-alpha.1 — 2026-10-08

Pierwsza wersja objęta Git, zapisująca bieżący stan aplikacji.

- Spis, stanowiska, import początkowy i eksport Excel z historią.
- Kontrola zgodności modeli, opcjonalne MU i wiele S/N jednej karty.
- Podmiany, potwierdzenia technika, obsługa rozbieżności i kontrolowane cofnięcie.
- Rejestracja nowych kart i wycofanie bez utraty historii.
- Statusy, przeniesienia, powroty z kalibracji/naprawy i słownik miejsc.
- Wybór podmiany z ATE, zapamiętywanie formularza i odczyt skanów S/N.
- Konta i role, kopie zapasowe, filtry historii i testy spójności.

Kalibrację przy podmianie potwierdza technik; brak/miniona data w bazie nie blokuje tej operacji. Dodanie zakupu bezpośrednio na ATE nadal kontroluje datę kalibracji.

Ograniczenia: użycie lokalne, brak automatycznej synchronizacji SharePoint, brak kamery/skanowania obrazu i brak automatycznego scalania baz.
