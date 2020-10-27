I projectet har vi sat en virtuel maskine op vha. DigitalOcean (VMs er kaldet droplets i DigitalOcean)
Denne maskine kører alle vores containere og har ip adressen vores domæne skal refere til.

For at tilgå maskinen bruger vi ssh.
Ssh er standard installeret i Windows så man kan åbne en ssh forbindelse med kommandoen: ssh user@host

Vi har sat en bruger op der hedder devdata og har koden zealand12345
Ip'en til droplet'en er 167.99.248.139

Dvs. at den endelige kommando for at lave forbindelse er:
ssh devdata@167.99.248.139

Du skal derefter skrive kodeordet (Det bliver ikke vist.)
Herefter har du fuld adgang til maskinen og kan gøre alt som man kan i command line interface.

 