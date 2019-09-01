Installation:

Requirements: node, yarn (oder npm)

1. Repository auschecken
2. In das ausgecheckte Verzeichnis wechseln
3. Abhängigkeiten installieren: yarn 
    - alternativ mit npm: npm install
4. Starten mit node index.js [parameter]


Alternativ kann man es auch ohne lokales node mit docker ausführen.
Docker Container starten:

Um eine Deckliste (decklist.txt) zu prüfen die im Verzeichnis /home/grummi/decklists/ liegt:

[Achtung, cards.cache wird im Verzeichnis /home/grummi/decklists/ angelegt]

docker run -v /home/grummi/decklists:/app/data --name scryfall-budget --rm scryfall-budget:latest --list data/decklist.txt

(das Verzeichnis /home/grummi/decklists wird im Container in /app/data gemountet. Die Deckliste wird relativ zum /app Verzeichnis aufgelöst. 
(--list data/decklist.txt entspricht --list /app/data/decklist.txt. Aufgrund des gemounteten Verzeichnisses: /home/grummi/decklists/decklist.txt))

Weitere Optionen können hinten angehangen werden (z.B. '--max 30', '--verbose')

docker run -v /home/grummi/decklists:/app/data --name scryfall-budget --rm scryfall-budget:latest --list data/decklist.txt --verbose --max 30

Um eine einzelne Karte zu prüfen:

docker run --rm scryfall-budget:latest -c "Conjurer's Closet"

[Optional kann auch hier mit "-v /home/grummi/decklists:/app/data" ein Verzeichnis für ein dauerhafte cards.cache Datei erzeugt werden]

Um die aufsteigend sortiert nach Preis anzuzeigen, den Parameter -s / --sort angeben.
