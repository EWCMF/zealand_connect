#Node.js website development environment sample with docker, tdd and nginx reverse proxy

NOTE:

To make docker containers able to see each other you may have to add them to the same network.

docker network create cluster

docker network connect cluster reverseProxy

docker network connect cluster node

docker network inspect cluster
