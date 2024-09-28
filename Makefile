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

ux:
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
	cd $(ROOT)/webapp && zip -qr $(ROOT)/target/ROOT.war .
	@rm -rf $(ROOT)/local_tomcat/webapps/*
	cp $(ROOT)/target/ROOT.war $(ROOT)/local_tomcat/webapps/

local_tomcat: war
	$(ROOT)/start_local_tomcat.sh

.PHONY: ux java-compile war local_tomcat