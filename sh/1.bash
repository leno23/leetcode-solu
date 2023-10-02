#!/usr/bin/bash


HOST="39.106.44.208"
USER=$1
PASS="@wW782625077"

XYZ=$(expect -c "
spawn ssh $USER@$HOST
expect \"password:\"
send \"$PASS\r\"
expect \"$ \"
expect \"Welcome*\"
send \"mkdir `date +%Y-%m-%d` \\r\"
expect \"$ \"
send \"exit\\r\"
")

echo "$XYZ"

~
~
