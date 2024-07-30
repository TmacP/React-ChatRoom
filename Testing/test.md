

clear ; curl -X POST -d "dbNamebleName=channels" http://localhost:8080/init ; echo ; echo ; curl -X POST http://0.0.0.0:8080/delete



echo ;curl -X GET http://0.0.0.0:8080/getallposts | grep -o '{[^}]*}' | tr '{' '\n' ; echo ; echo 
