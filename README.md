# Zealand Connect

NOTE: Hvis du køre node.js uden om docker skal du ændre host/IP i koden til 127.0.0.1, men denne IP må ikke commites. Hvis igennem docker kør disse kommandoer i rækkefølgen de bliver liste mens node.js docker og db docker kør:

docker network create cluster

docker network connect cluster node

docker network connect cluster db

docker network inspect cluster
