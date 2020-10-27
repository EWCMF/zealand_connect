CI-miljøet er sat op vha. GitHub Actions.
GitHub Actions er handlinger der sker som følge af GitHub events som commit, push, pull osv.

De specifikke handlinger der er sat op kan ses i .github/workflows folder'en.
Hvert workflow sættes i gang via yml filer. Dvs. at filerne skal skrives i YAML programmeringssproget.
YAML er et sprog hvor indlejring har betydning ligesom i Python.
GitHub tilbyder mange templates for at hjælpe med at sætte det op men du kan også skrive hele workflow'et selv.

Specifikt i vores projekt er en .yml fil til at build en node.js applikationen der også laver tests, samt en til at bygge et Docker image.
Filen der bygger Docker image push'er også automatisk image'et til Docker Hub og starter det nye image i VM'en via SSH.

Hvis adgang til Docker Hub brugeren er nødvendig:
Docker id: zealandconnect
Password: zealand12345  
