where-am-i = $(CURDIR)/$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_MAKEFILE := $(call where-am-i)
#$(info $(THIS_MAKEFILE))
ROOT := $(dir $(THIS_MAKEFILE))
JAVAC?=javac
SRC_JAVA:=$(ROOT)/src
SRC_ROOTS:= $(SRC_JAVA)
JVM_VERSION:=11
JAVA_BUILD:=$(ROOT)/webapp/WEB-INF/classes
ALL_LIBS_LIST:=$(shell find $(ROOT)/webapp/WEB-INF/lib $(ROOT)/SERVER -name '*.jar' -printf '%p:')
#$(info "All Libs List " $(ALL_LIBS_LIST))

all: war

local_ux: 
	@cd ${ROOT}/UX/react-api-tester && npm install
	@echo "stopping old vite"
	@bash -c 'pid=`fuser 5173/tcp 2>/dev/null | tr -d '[:blank:]'` && test -z "$$pid" || { echo "killing $$pid"; kill -SIGKILL $$pid; }'
	@echo "starting new vite"
	@cd ${ROOT}/UX/react-api-tester && bash -c "npm run dev &"
	@echo "starting insecure chromium"
	@${ROOT}/start_chromium.sh "http://localhost:5173/"
ux:
	@cd ${ROOT}/UX/react-api-tester && npm install
	@cd ${ROOT}/UX/react-api-tester && npm run build
	@rm -f ${ROOT}/webapp/index.html 
	@rm -rf ${ROOT}/webapp/assets 
	@cp ${ROOT}/UX/react-api-tester/dist/index.html ${ROOT}/webapp/index.html 
	@cp -a ${ROOT}/UX/react-api-tester/dist/assets ${ROOT}/webapp/assets  
	

java-compile: 
	@echo Compile java
	@rm -rf $(JAVA_BUILD)
	@mkdir -p $(JAVA_BUILD)
	@rm -f $(JAVA_BUILD)/java_list
	@echo JAVAC VERSION
	$(JAVAC) -version
	@find $(SRC_JAVA) -name '*.java' > $(JAVA_BUILD)/java_list
	@$(JAVAC) -encoding utf8 -source $(JVM_VERSION) -target $(JVM_VERSION) \
		-cp $(ALL_LIBS_LIST) \
		-d $(JAVA_BUILD) @$(JAVA_BUILD)/java_list
	@rm -f $(JAVA_BUILD)/java_list

war:  java-compile ux
	rm -rf $(ROOT)/target
	mkdir -p $(ROOT)/target
	rm -rf $(ROOT)/local_tomcat/webapps
	mkdir -p $(ROOT)/local_tomcat/webapps
	cd $(ROOT)/webapp && zip -qr $(ROOT)/target/ROOT.war .
	cp $(ROOT)/target/ROOT.war $(ROOT)/local_tomcat/webapps/

local_tomcat: war
	$(ROOT)/start_local_tomcat.sh

.PHONY: all ux java-compile war local_tomcat