package app;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.Iterator;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

import utils.JsonUtils;

public class App {
	final String root;
	private App(String r) {
		this.root=r;
	}
	private void init() {
		// to init stuff
	}
	private static class Helper {
		final static App app=initApp();
		private static App initApp() {
			App tmp=new App(AppContextListener.getRoot());
			tmp.init();
			return tmp;
		}
	}
	public static App getApp() {return Helper.app;}
	public static String getAppCookieName() {return "api-tester";}
	
	
	synchronized public JsonObject checkUserByCookie(String cookie) throws IOException {
		// poor's man database
		JsonElement cookies = JsonParser.parseString(new String(Files.readAllBytes(new File(root+"/WEB-INF/data/cookiesdb.json").toPath()), StandardCharsets.UTF_8));
		String login=JsonUtils.getString(cookies, cookie);
		if (login!=null) {
			JsonElement users = JsonParser.parseString(new String(Files.readAllBytes(new File(root+"/WEB-INF/data/usersdb.json").toPath()), StandardCharsets.UTF_8));
			JsonObject userInfo = JsonUtils.getJsonObject(users, login);
			return userInfo;
		}
		return null;
	}
	synchronized public JsonObject checkAddUserCookie(String login, String password, String newCookie) throws JsonSyntaxException, IOException {
		JsonElement users = JsonParser.parseString(new String(Files.readAllBytes(new File(root+"/WEB-INF/data/usersdb.json").toPath()), StandardCharsets.UTF_8));
		String storedPassword=JsonUtils.getString(users, login, "password");
		if (storedPassword!=null && storedPassword.equals(password)) {
			saveUserCookie(login, newCookie);
			return JsonUtils.getJsonObject(users, login);
		}
		return null;
	}
	private void saveUserCookie(String login, String newCookie) throws JsonSyntaxException, IOException {
		JsonObject cookies = JsonParser.parseString(new String(Files.readAllBytes(new File(root+"/WEB-INF/data/cookiesdb.json").toPath()), StandardCharsets.UTF_8)).getAsJsonObject();
		cookies.addProperty(newCookie, login);
		Files.write(new File(root+"/WEB-INF/data/cookiesdb.json").toPath(),cookies.toString().getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE,StandardOpenOption.TRUNCATE_EXISTING);
		
	}
	synchronized public boolean removeCookie(String cookie) throws IOException {
		JsonObject cookies = JsonParser.parseString(new String(Files.readAllBytes(new File(root+"/WEB-INF/data/cookiesdb.json").toPath()), StandardCharsets.UTF_8)).getAsJsonObject();
		JsonElement removed = cookies.remove(cookie);
		String removedLogin=JsonUtils.getString(removed);
		if (removedLogin!=null) for (Iterator<String> cookiesIterator = cookies.keySet().iterator(); cookiesIterator.hasNext();) {
			String storedCookie=cookiesIterator.next();
			String dupLogin=JsonUtils.getString(cookies, storedCookie);
			if (removedLogin.equals(dupLogin)) {
				cookiesIterator.remove();
			}
		}
		Files.write(new File(root+"/WEB-INF/data/cookiesdb.json").toPath(),cookies.toString().getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE,StandardOpenOption.TRUNCATE_EXISTING);
		return removed!=null;
	}
	
	
}
