# Maintenance — uruchomienie na komputerze administratora

Wersja lokalna, aktualizacja 08.10.2026. Baza aplikacji jest źródłem danych. Excel jest eksportem do przeglądania i ręcznego umieszczenia na SharePoint.

## Uruchomienie

Otwórz Uruchom.cmd i pozostaw okno serwera otwarte. W przeglądarce otwórz http://127.0.0.1:8765/. Użyj dotychczasowego konta; aktualizacja nie zmienia hasła. Po aktualizacji odśwież stronę i zaloguj się ponownie. Na tym komputerze używany jest dostępny Python; na innym potrzebny jest Python 3.11+ oraz pakiety z requirements.txt.

Serwer domyślnie udostępnia aplikację tylko na tym komputerze. Konta określają autora operacji. Dostęp innych komputerów i uruchamianie jako usługa wymagają osobnego wdrożenia.

## Pierwsze użycie po aktualizacji

Dotychczasowe karty otrzymują status techniczny „nieustalony”. Nie zakładamy automatycznie ich sprawności. Administrator po sprawdzeniu karty potwierdza jej S/N, miejsce i status w zakładce „Do weryfikacji”. Do podmiany wymagany jest status „sprawna” oraz zaznaczenie przez technika potwierdzenia ważnej kalibracji lub braku wymogu kalibracji. Data w bazie nie blokuje podmiany i nie jest automatycznie zmieniana. Dane kalibracji poprawia administrator w szczegółach karty.

## Podmiana

1. Wybierz stanowisko. Wyszukaj kartę wkładaną po S/N, MU, modelu lub miejscu.
2. Wybierz kartę wyjmowaną. Lista ogranicza się do zgodnego modelu i wybranego stanowiska. Spacje i zapis PXI-E/PXIe są normalizowane przy porównaniu; różne modele i rodziny pozostają rozdzielone.
3. Podaj cel, miejsce odłożenia i status wyjmowanej karty.
4. Sprawdź fizycznie S/N i miejsce obu kart oraz miejsce odłożenia. Zaznacz potwierdzenia lokalizacji i kalibracji, a następnie zapisz.

Brak MU nie blokuje wymiany. Identyfikację opieramy na S/N. Znak „+” łączy numery jednej karty; rekord pozostaje jedną kartą. Wspólny S/N w różnych rekordach wymaga wyjaśnienia.

Obie lokalizacje i historia zapisują się razem. Jeśli dane zmieniły się od ich odczytania, aplikacja odrzuca operację i wymaga odświeżenia. Cofnięcie przez administratora jest możliwe tylko, jeśli karty nie zostały później zmienione.

## Inna karta na stanowisku

Wybierz rekord oczekiwanej karty i „Na stanowisku jest inna karta niż w bazie”. Potwierdź rozbieżność; wskaż rzeczywistą kartę albo dodaj jej S/N i model. Oczekiwana, nieodnaleziona karta dostaje lokalizację „Nieustalona”, status „do sprawdzenia” i oznaczenie do weryfikacji. Rzeczywista karta otrzymuje miejsce na stanowisku. Operacja trafia do historii. Następnie wykonaj zwykłą podmianę.

Administrator zamyka weryfikację po odnalezieniu i fizycznym sprawdzeniu karty. Powód, miejsce i zmiana zostają w historii. Nierozwiązany powtórzony S/N blokuje zamknięcie.

## Eksport i konta

„Eksportuj Excel” pobiera aktualny spis ze statusem, historią i informacją o czasie eksportu. Zapisana wcześniej kopia Excela nie odświeża się automatycznie. Wgraj nowy eksport na SharePoint. Edycja Excela nie zmienia bazy aplikacji; import służy obecnie tylko pierwszemu zasileniu pustej bazy.

W „Baza i użytkownicy” administrator dodaje konta, zmienia rolę, blokuje konto i ustawia nowe hasło. Zmiana konta unieważnia jego sesje. Aplikacja chroni ostatniego aktywnego administratora.

## Kopie i odzyskanie

Przy uruchomieniu powstaje jedna automatyczna kopia na dany dzień w backups. Przy ciągłej pracy serwer sprawdza co godzinę, czy potrzebna jest kopia nowego dnia. Kopia jest sprawdzana pod kątem integralności. Uruchomienie backup.py wykonuje dodatkową kopię ręczną. Kopie nie są automatycznie kasowane. Kopiuj je regularnie na osobny dysk lub firmowy zasób — kopia na tym samym dysku nie chroni przed jego awarią.

Aby odzyskać bazę: zamknij serwer, zachowaj cały folder data jako kopię, utwórz nowy folder data i skopiuj wybraną kopię jako data/maintenance.sqlite3. Nie przenoś do niego starych plików -wal/-shm. Uruchom ponownie i sprawdź karty oraz historię. Odzyskiwanie cofa dane do daty kopii.

Zachowuj używany folder aplikacji. Nie zastępuj działającej bazy plikiem z archiwum aktualizacji, jeśli wykonano już nowe operacje.

## Nowy zakup i wycofanie ze spisu

Administrator w „Spis kart” wybiera „Dodaj nową kartę”. Wymagane są S/N, model, hala, lokalizacja, powód dodania i potwierdzenie fizyczne. MU jest opcjonalny. Domyślne miejsce to Maintenance / Magazyn MD. Kilka S/N połączonych znakiem + pozostaje jednym rekordem. Powtórzenie któregokolwiek S/N, także w archiwum, blokuje dodanie drugiego rekordu.

Można wpisać ATE / SATE / VATE jako pierwszą lokalizację nowej karty. Wtedy wymagane są status „sprawna”, aktualna kalibracja lub „Nie dotyczy” i dodatkowe potwierdzenie nowego montażu. Istniejące wyposażenie stanowiska nie jest automatycznie wyjmowane — jeżeli jest to wymiana, najpierw dodaj zakup do magazynu, a następnie wykonaj podmianę.

W szczegółach aktywnej karty administrator wybiera „Wycofaj ze spisu”. Podaje powód (np. nienaprawialne uszkodzenie), faktyczne miejsce odłożenia lub utylizacji poza ATE i potwierdza S/N. Karta otrzymuje status „wycofana” i znika z aktywnego spisu, list podmian oraz wyposażenia ATE. Dane pozostają w „Karty wycofane”, historii i osobnym arkuszu eksportu. Nie jest to trwałe kasowanie ani operacja z funkcją przywrócenia w interfejsie. Kartę możliwą do naprawy oznacz statusem „naprawa” zamiast wycofywać ją definitywnie.

Dodanie i wycofanie zapisują autora, datę, powód i stan rekordu. Wycofanie odrzuca zapis na nieaktualnej wersji rekordu.

## Filtrowanie i potwierdzenie przed podmianą

Wybór stanowiska ogranicza karty wkładane do modeli występujących na tym stanowisku, z wyłączeniem kart już na nim zamontowanych. Zmiana stanowiska czyści poprzedni wybór i wyszukiwanie. Wybór konkretnej karty dodatkowo ogranicza drugą listę do tego samego modelu.

Przy karcie wkładanej ze statusem nieustalonym lub brakującą/nieaktualną kalibracją administrator może wybrać „Potwierdź sprawność / kalibrację”. Sprawdza fizycznie kartę, podaje faktyczny status i kalibrację oraz uzasadnienie. Operacja trafia do historii; formularz podmiany zachowuje wybór kart, cel i miejsce odłożenia. Samo wybranie karty nie zmienia jej statusu.

Aktualizacja kalibracji przy podmianie: obowiązkowe potwierdzenie technika zastępuje automatyczną blokadę na podstawie daty. Potwierdzenie zapisuje się w historii i eksporcie. Dotyczy formularza podmiany; rejestracja nowego zakupu bezpośrednio na ATE nadal sprawdza podaną datę.

## Usprawnienia obsługi — aktualna wersja

- W wyposażeniu ATE przy konkretnej karcie dostępny jest przycisk „Podmień tę kartę”. Ustawia stanowisko i kartę wyjmowaną; lista wkładanych pokazuje zgodne modele.
- Formularz podmiany zapamiętuje dane w bieżącej karcie przeglądarki dla zalogowanego konta. Po odświeżeniu otwórz „Nowa podmiana” i „Przywróć formularz”. Potwierdzenia fizyczne nie są zapamiętywane. Jeśli wersja wybranej karty się zmieniła, trzeba wybrać ją ponownie. Zamknięcie karty przeglądarki może usunąć szkic.
- W potwierdzeniu podmiany można skanować S/N czytnikiem działającym jak klawiatura (Enter po numerze). Przy kilku S/N połączonych + zeskanuj każdy numer; błędny numer nie potwierdza karty. Skan nie sprawdza fizycznego miejsca — operator nadal musi to zrobić. Kamera i rozpoznawanie obrazu nie są obsługiwane.
- W szczegółach aktywnej karty „Przenieś / powrót z usługi” rejestruje ruch bez drugiej karty. Wybierz miejsce, status i powód, a następnie potwierdź fizyczny S/N i oba miejsca. Dostęp mają technik i administrator.
- Powrót z kalibracji lub naprawy wymaga wyniku pozytywnego/negatywnego i numeru świadectwa/zlecenia. Termin kalibracji jest opcjonalny. Negatywny wynik blokuje status „sprawna”, ale nie wycofuje karty automatycznie. Montaż na ATE wymaga potwierdzenia sprawności, kalibracji i tego, że operacja nie zastępuje innej karty. Dla wymiany nadal służy podmiana.
- Zakładka „Lokalizacje” zawiera miejsce i przypisaną halę. Początkowy słownik pochodzi z istniejących danych; zachowuje ich pisownię. Administrator dodaje i wyłącza miejsca. Wyłączenie blokuje nowe ruchy do tego miejsca; nie zmienia obecnych kart ani historii. Aby poprawić nazwę miejsca, dodaj właściwy zapis i wyłącz stary, a karty przenieś z zachowaniem historii. W formularzach lokalizacja i hala są wybierane wspólnie ze słownika. Dział kalibracji jest przypisany do H2.
- Historia ma filtry rodzaju operacji, autora, zakresu dat oraz tekstu (S/N, MU, ATE, powód). Szczegóły pokazują statusy i kalibrację przed/po. Eksport historii zawiera również te pola.
- W „Baza i użytkownicy” administrator widzi datę i nazwę ostatniej kopii oraz zgłoszony błąd automatycznej kopii. „Wykonaj kopię teraz” wykonuje kopię i kontroluje jej integralność. Nadal kopiuj pliki z backups na osobny nośnik.

Przenoszenie i podmiana odrzucają zapis na nieaktualnej wersji karty. Zmiany są atomowe: karta i jej historia zapisują się razem. Wszystkie testy wykonywano na odrębnej bazie; aktualizacja zachowuje spis, statusy i historię głównej bazy.

## Nowe stanowiska — 0.1.0-alpha.2

Administrator wybiera „Stanowiska ATE” → „Dodaj stanowisko”, wpisuje nazwę (np. ATE 16, SATE 04, VATE 2.1) i halę. Puste stanowisko od razu pojawia się na liście. Otwórz je i wybierz „Dodaj nową kartę”: miejsce i hala wypełnią się automatycznie. Możesz też przenieść istniejącą kartę do tego miejsca z jej szczegółów. Dla wymiany istniejącego wyposażenia użyj podmiany.

Nowe stanowiska są wpisami słownika lokalizacji. Historia zachowuje ich utworzenie. Wyłączenie odbywa się w „Lokalizacje” i nie usuwa istniejących kart. Nazwy ATE16 i ATE 16 są traktowane jako to samo stanowisko; nie można założyć kolejnego o tej samej nazwie dla innej hali.

## Stan magazynowy — 0.1.0-alpha.3

Zakładka „Stan magazynowy” pokazuje karty w magazynach, sprawny zapas i brakujące modele dla każdego ATE/SATE/VATE. Jedna karta o kilku S/N liczy się jako jedna sztuka. Wspólny zapas jednego modelu może zabezpieczać kilka stanowisk przy pojedynczej awarii; nie oznacza osobnej rezerwy dla każdego ATE.

Liczone są aktywne karty o statusie sprawna, bez blokad danych i bez współdzielonego S/N z innym rekordem. Kalibrację operator potwierdza przed montażem; data nie blokuje zaliczenia do zapasu. Modele porównujemy tak jak przy podmianie (m.in. PXI-E = PXIe), zachowując rozróżnienie PXI i PXIe.

Przy aktualizacji jako magazyn oznaczane są istniejące lokalizacje zaczynające się od Magazyn, Magazn, Półka oraz 33-B. Administrator może zmienić wybór przez „Wybierz lokalizacje magazynowe”. Nowe miejsca wymagają świadomego oznaczenia jako magazyn. Serwis i kalibracja domyślnie nie są magazynem. Puste stanowiska są oznaczone jako brak wyposażenia do oceny.

## Weryfikacja spisu bez podmiany

W spisie kart lub po otwarciu konkretnego ATE wybierz „Weryfikuj / popraw”. Administrator może poprawić opis tej samej karty. Opcja „Na stanowisku jest inna karta” jest dostępna także dla technika: wskazuje kartę znalezioną (istniejącą lub nową), zapisuje stan zastany i oznacza nieodnalezioną kartę do weryfikacji. Nie wykonuje fizycznej podmiany ani nie otwiera formularza podmiany po zapisie. Obie operacje zapisują historię.

## Nowy spis z Excela

Administrator: Baza i użytkownicy → Nowy spis z Excela. Podaj nazwę, wybierz XLSX w dotychczasowym układzie Maintenance, sprawdź podgląd i potwierdź. Tworzony jest nowy aktywny rejestr w tym samym pliku roboczym SQLite. Stary rejestr wraz z historią i kontami jest wcześniej archiwizowany w pełnej kopii w backups (nazwa w historii nowego spisu). Konta użytkowników pozostają aktywne. Karty otrzymują domyślnie status nieustalony. Import nie scala danych, nie importuje historii z Excela i nie obsługuje dowolnych układów kolumn.

Powrót do archiwum: zatrzymaj serwer i uruchom server.py --db z pełną ścieżką do kopii; najlepiej pracuj na jej skopiowanym egzemplarzu. W tej wersji nie ma przełącznika wielu baz w interfejsie.

## Plan kalibracji

Wybierz karty ręcznie albo importuj XLSX z nagłówkami MU i/lub SN (Numer MU, Numer seryjny), w pierwszym wierszu jednego arkusza. Kolejność kolumn dowolna. W podglądzie wybierz jednoznaczne dopasowania; brak zgodności SN/MU nie jest automatycznie rozstrzygany. Nierozpoznane wiersze nie trafiają do planu. Numery zapisuj jako tekst. Plan odnosi się do jednej karty także wtedy, gdy ma kilka SN rozdzielonych +.

Postęp wynika z operacji wykonanych po utworzeniu pozycji. Użyj przycisku Podmień pod kalibrację, aby otworzyć standardowy formularz z celem Kalibracja. Cofnięcie operacji usuwa jej zaliczenie w planie. Powrót rejestruj przez Przenieś / powrót; zakończenie planu wymaga opisu wyniku. Zamknięcie planu samo nie zmienia statusu technicznego. Karta może mieć tylko jedną otwartą pozycję; po zamknięciu można utworzyć kolejny cykl. Lista pokazuje bieżące lokalizacje i umożliwia przegląd zamkniętych pozycji.
