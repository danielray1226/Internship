package app;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.net.URLCodec;
import org.apache.hc.core5.http.message.BasicHeader;

import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import utils.FullHttpResponse;
import utils.HttpConnector;
import utils.JsonUtils;

/**
 * Servlet implementation class APICaller
 */
@WebServlet("/APICaller")
public class APICaller extends HttpServlet {
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
    
    final static String TEST_API_SERVER_URL="http://localhost:8000/TestAPI";
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		try {
		
			/*
			will expect following json object, e.g.:
			{
				"path" : "/artifact-fields/{field-id}/options",
				"method" : "get",
				"parameters" : [
					{
						"name": "field-id",
						"value" : 123
					}, 
					{
						"name": "project",
						"value": "FooBar"
					}
				],
				"body" : "POST body as a string or json"
			}
			Upon receiving, reconcile with openapi.json, and call the test server
			 */
			
			JsonElement req = JsonParser.parseReader(request.getReader());
			String path=JsonUtils.getString(req, "path");
			if (path==null) throw new RuntimeException("No \"path\" in request: "+JsonUtils.prettyPrint(req));
			String method=JsonUtils.getString(req, "method");
			if (method==null) throw new RuntimeException("No \"method\" in request: "+JsonUtils.prettyPrint(req));
			path=path.toLowerCase();
			method=method.toLowerCase();
			
			JsonObject pathMethodDef=JsonUtils.getJsonObject(App.getApp().getOpenApi(),"paths", path, method);
			if (pathMethodDef==null) throw new RuntimeException("No paths/"+path+"/"+method+" in openapi for request: "+JsonUtils.prettyPrint(req));
	
			Map<String,JsonObject> openApiParamToParamDef=new HashMap<>();
			for (JsonElement openApiParam : JsonUtils.getJsonArrayIterable(pathMethodDef, "parameters")) {
				String paramName=JsonUtils.getString(openApiParam, "name");
				if (paramName==null) continue;
				openApiParamToParamDef.put(paramName, openApiParam.getAsJsonObject());
			}
			// Lets derive the actual call, pathUrl as a base
			String pathUrl=path;
			String paramsUrl="";
			URLCodec urlCodec=new URLCodec("UTF-8");

			
			
			for (JsonElement reqParam : JsonUtils.getJsonArrayIterable(req, "parameters")) {
				String reqParamName=JsonUtils.getString(reqParam, "name");
								
				
				JsonObject paramDef=openApiParamToParamDef.get(reqParamName);
				if (paramDef==null) throw new RuntimeException("Unknown parameter "+reqParamName+" for 'paths/"+path+"/"+method+"' in openapi for request: "+JsonUtils.prettyPrint(req));
				
				String reqValue= JsonUtils.getString(reqParam, "value");
				if (reqValue==null) {
					Long num = JsonUtils.getLong(reqParam, "value");
					if (num!=null) reqValue=num.toString();
					if (reqValue==null) {
						Boolean b=JsonUtils.getBoolean(reqParam, "value");
						if (b!=null) reqValue=b.toString();	
					}
					if (reqValue==null) throw new RuntimeException("Invalid parameter "+reqParamName+" type, expect string or number, or boolean; paths/"+path+"/"+method+" in openapi for request: "+JsonUtils.prettyPrint(req));
				}

				
				String inType=JsonUtils.getString(paramDef, "in");
				if ("path".equals(inType)) {
					// its a 'path' parameter, lets replace the value

					// replace it in url
					String encValue=urlCodec.encode(reqValue);
					pathUrl=pathUrl.replace("{" + reqParamName + "}", encValue);
				} else if ("query".equals(inType)) {
					if (!paramsUrl.isEmpty())  paramsUrl+="&";
					paramsUrl+= (urlCodec.encode(reqParamName)+"="+urlCodec.encode(reqValue) );
				} else {
					throw new RuntimeException("parameter in type: "+inType+" is not supported, paths/"+path+"/"+method+" in openapi for request: "+JsonUtils.prettyPrint(req));	
				}
			}

	
			// TODO: remove calls for unauthenticated users
			
			Cookie appCookie = App.getApp().getRequestCookie(request);
			JsonObject userInfo = null;
			if (appCookie != null) {
				userInfo = App.getApp().checkUserByCookie(appCookie.getValue());
			}
			if (userInfo==null) {
				System.err.println("USER IS NOT AUTHENTICATED, ONLY DEV WORK FOR: "+JsonUtils.prettyPrint(req));
				//response.setStatus(403);
			}
			String myAutorizationToken=JsonUtils.getString(userInfo, "apiToken");
			if (myAutorizationToken==null) myAutorizationToken="DevTestingOnly";
			
			// Time to make actual call
			String url=TEST_API_SERVER_URL+pathUrl;
			if (!paramsUrl.isEmpty()) {
				url+="?";
				url+=paramsUrl;
			}
			
			JsonObject respObject=new JsonObject();
			respObject.addProperty("url", url);
			
			HttpConnector httpConnector = App.getApp().getHttpConnector();
			
			FullHttpResponse apiResponse=null;
			if (method.equals("get")) {
				apiResponse=httpConnector.callGet(url, new BasicHeader("Autorization", "Bearer "+myAutorizationToken),new BasicHeader("User-Agent", "My API Tester"));
			} else {
				String body=JsonUtils.getString(req, "body");
				if (body==null) {
					JsonElement bodyElement = JsonUtils.getJsonElement(req, "body");
					if (bodyElement!=null && bodyElement.isJsonNull()) {
						body=bodyElement.toString();
					}
				}
				if (body==null) body="";
				apiResponse=httpConnector.callMethod(method, url, "application/json", body.getBytes(StandardCharsets.UTF_8));
			}
			if (apiResponse.getException()!=null) {
				respObject.addProperty("success", false);
				respObject.addProperty("error", apiResponse.getException().getMessage());
				response.setStatus(500);
			} else {
				respObject.addProperty("statusCode", apiResponse.getStatusCode());
				respObject.addProperty("contentType",apiResponse.getContentType());
				respObject.addProperty("success", true);
				byte[] data = apiResponse.getData();
				if (data!=null && data.length>0) {
					try {
						// lets try to parse response as json
						JsonElement jsonData = JsonParser.parseString(new String(data, StandardCharsets.UTF_8));
						respObject.add("data", jsonData);
					} catch (Exception ex) {
						respObject.addProperty("success", false);
						respObject.addProperty("error", ex.getMessage());
					}
				} else {
					respObject.add("data", JsonNull.INSTANCE);
				}
			}
			response.getWriter().write(respObject.toString());
			
		} catch (Exception ex) {
			JsonObject err=new JsonObject();
			err.addProperty("success", false);
			err.addProperty("error", ex.getMessage());
			ex.printStackTrace();
			
			response.getWriter().write(err.toString());
			response.setStatus(500);
			throw new RuntimeException(ex);
		}
	}

}
