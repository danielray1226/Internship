package app;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import utils.JsonUtils;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/logoff")
public class LogoffServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LogoffServlet() {
	}

	/**
	 * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Cookie appCookie = null;
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie c : cookies) {
				if (App.getAppCookieName().equals(c.getName())) {
					appCookie = c;
					break;
				}
			}
		}
		if (appCookie!=null) {
			if (App.getApp().removeCookie(appCookie.getValue())) {
				response.setStatus(200);
			} else {
				System.err.println("Unknown cookie: "+appCookie.getValue());
				response.setStatus(500);
			}
		}
	}

}
