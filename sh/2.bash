#!/usr/bin/bash


APP=$1
USER=$2
HOST=$3
PASS=$4


XYZ=$(expect -c "
spawn scp ./$APP.zip $USER@$HOST:/home/nodejs/
expect \"password:\"
send \"$PASS\r\"
send \"unzip /home/nodejs/$APP.zip\"
expect \"$ \"
send \"exit\\r\"
")

echo "$XYZ"

~
~
~

# sh 2.bash blog nodejs 39.106.44.208 @wW782625077