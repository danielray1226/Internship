#!/bin/bash

DEFAULT_URL="http://localhost:5173/"
URL="${1:-$DEFAULT_URL}"

#kill all insecure chromiums
 ps --columns=4000 -e -o pid,args | grep '[c]hromium.*disable-web-security' | while read line 
 do
	echo "Detected chromium process: ${line}"
	pid=`echo ${line} | cut -d' ' -f1`
	test -z "$pid" || {
		echo killing $pid
		kill -SIGKILL $pid
	}	
done


echo "Starting dev chromium on $URL"
chromium --disable-web-security --user-data-dir=/tmp "$URL" &

echo "Running insecure chromium with ${URL}"
