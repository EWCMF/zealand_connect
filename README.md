# Zealand Connect

Dette er en webserver lavet til at gøre det nemmere for virksomheder og studerende på Zealand Næstved at danne netværk. Den er byggede med Node.js og Express hvor Handlebars er template engine'en.

## Deployment

Projektet sættes nemmest op vha. Docker, hvor Mariadb databasen og Node app'en begge har en docker-compose fil der gør det let at deploy på din maskine. En maskine der kører en linux distribution er fortrukket at køre projektet på, men andre OS'er burde være mulige også. Yderligere skal nogle trin fuldføres inden man eksekverer docker-compose up.

For databasen:

- En variabel DB_PW skal defineres i ens shell således at docker-compose kan se den. På Linux gøres dette med kommandoen: export "DB_PW=passwordher" (Vælg password selv)

For Node app'en:
- En mappe uploads skal laves med den fulde sti: ~/uploads
- En .env fil skal laves i nodes mappen med følgende variabler:
    - DB_PROD_HOST=database
    - DB_PROD_USER=root
    - DB_PROD_PASS=passwordher (Vælg password selv)
    - DB_PROD_DATABASE=ZealandConnect
    - DB_PORT=3306

Efter dette kan begge docker-compose filer startes med kommandoen: 'docker-compose up -d'. -d argumentet gør at containerne kører i baggrunden. Projektet er nu startet og siden kan tilgås på localhost med port 3000. Det anbefales efterfølgende at en reverse proxy opsættes vha. Nginx og at Certbot installeres for nem brug af HTTPS.

## Licens

Projektet er Free Open Source Software med betingelser pålagt af copyleft licenset: GNU General Public License v3.0
