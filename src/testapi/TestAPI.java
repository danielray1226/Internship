package testapi;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Map;
import java.util.Map.Entry;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.App;
import utils.JsonUtils;

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
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		System.out.println("Path: " + request.getPathInfo());
		System.out.print(method);
		
		// Lets try to generate a file path, we can use for testing
		String testFileName=method.toLowerCase()+request.getPathInfo();
		
		Map<String, String[]> params = request.getParameterMap();
		for (Entry<String, String[]> entry : params.entrySet()) {
			String param=entry.getKey();
			String[] values=entry.getValue();
			for (String v : values) {
				testFileName+= ("_"+param+"_"+v);
				System.out.println(param+" = "+v);
			}
		}
		testFileName=testFileName.replaceAll("/", "_");
		testFileName=testFileName.replaceAll(" ", "");
		
		File testFile=new File(App.getApp().getRoot()+"/WEB-INF/test_api_data/"+testFileName+".json");
		System.err.println("Looking up data in: "+testFile);
		
		if (testFile.exists()) {
			//JsonElement testStuff = JsonParser.parseString(new String(,
			JsonElement testReply = JsonParser.parseString(new String(Files.readAllBytes(testFile.toPath()), StandardCharsets.UTF_8));
			int status=JsonUtils.getInteger(testReply, "status");
			JsonElement data = JsonUtils.getJsonElement(testReply, "data");
			response.getWriter().write(data.toString());
			response.setStatus(status);
		} else {
			response.setStatus(404);
		}
	}

}
