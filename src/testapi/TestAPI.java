package testapi;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.logging.Handler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.json.JSONParser;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

/**
 * Servlet implementation class TestAPI
 */
@WebServlet("/TestAPI/*")
public class TestAPI extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestAPI() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#service(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String method = request.getMethod();
		String path = request.getPathInfo();

		System.out.println("Path: " + request.getPathInfo());
		System.out.print(method);
		BufferedReader reader = request.getReader();
		JsonElement jsonrequest = JsonParser.parseReader(reader);
		System.out.print(jsonrequest);
		if ("/".equals(path)) {
			handleRoot(jsonrequest, response);
		}
		/*
		        "get": {
                "description": "Validate that a connection can be successfully established to the repository and all of its services are running normally.",
                "operationId": "validate",
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                
                            }
                        },
                        "description": "Successful connection"
                    },
                    "401": {
                        "content": {
                            "application/problem+json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Problem"
                                }
                            }
                        },
                        "description": "Not authenticated"
                    },
                    "500": {
                        "content": {
                            "application/problem+json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Problem"
                                }
                            }
                        },
                        "description": "Unable to process request"
                    }
		 */
	}

	private void handleRoot(JsonElement jsonrequest, HttpServletResponse response) throws IOException {
		response.getWriter().write("{}");
		response.setContentType(getServletInfo());
		response.setStatus(200);
	}

}
