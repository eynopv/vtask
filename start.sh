#!/bin/sh

docker build --tag eynopv-solution . && docker run --rm --name eynopv-solution -p 3000:3000 eynopv-solution
