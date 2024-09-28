#!/bin/sh


MYDIR=$(dirname $0)

CLASSPATH=${MYDIR}/SERVER/apache-tomcat-9.0.48/bin/bootstrap.jar:${MYDIR}/SERVER/apache-tomcat-9.0.48/bin/commons-daemon.jar:${MYDIR}/SERVER/apache-tomcat-9.0.48/bin/tomcat-juli.jar

java -Dcatalina.base=${MYDIR}/local_tomcat \
	-Dcatalina.home=${MYDIR}/SERVER/apache-tomcat-9.0.48 \
	--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED \
	--add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED \
	--add-opens=java.rmi/sun.rmi.transport=ALL-UNNAMED \
	-Dfile.encoding=UTF-8 \
	-classpath "${CLASSPATH}" \
	org.apache.catalina.startup.Bootstrap start
