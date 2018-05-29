package com.mkyong.rest;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;

@Path("/java")
public class HelloWorldService {

	@GET
	@Path("/compute")
	public Response compute(@PathParam("param") String msg) {
 
		String output = "Jersey say : " + msg;
		
		ArrayList<Number> primeNumbers = new ArrayList<Number>();
		
		for (int i = 2; primeNumbers.size() < 500; i++) {
			boolean divisorFound = false;
			for (int count = 2; count < i; count++) {
				divisorFound = false;
				if (i % count == 0) {
					divisorFound = true;
					break;
				}	
			}

			if (divisorFound == false) { primeNumbers.add(i); }
		}
		System.out.println(primeNumbers);
 
		return Response.status(200).entity(output).build();
 
	}
	
	@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/dbquery")
	public Response dbQuery(@PathParam("param") String msg) throws UnknownHostException {
 
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject searchQuery = new BasicDBObject();
		DBCursor cursor = table.find(searchQuery);
		
		//ArrayList<DBObject> primeNumbers = new ArrayList<DBObject>();

		while (cursor.hasNext()) {
			System.out.println(cursor.next());
			//primeNumbers.add(cursor.next());
		}
		
		return Response.status(200).entity("dgsdg").build();
 
	}
	
	@GET
	@Path("/cruddbquery")
	public Response cruddbquery(@PathParam("param") String msg) throws UnknownHostException {
 
		addProduct();
		updateProduct();
		deleteProduct();
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject searchQuery = new BasicDBObject();
		DBCursor cursor = table.find(searchQuery);

		while (cursor.hasNext()) {
			System.out.println(cursor.next());
		}
		
		return Response.status(200).entity("dbquery").build();
 
	}
	
	@GET
	@Path("/computedbquery")
	public Response computedbquery(@PathParam("param") String msg) throws UnknownHostException {
 
        ArrayList<Number> primeNumbers = new ArrayList<Number>();
		
		for (int i = 2; primeNumbers.size() < 500; i++) {
			boolean divisorFound = false;
			for (int count = 2; count < i; count++) {
				divisorFound = false;
				if (i % count == 0) {
					divisorFound = true;
					break;
				}	
			}

			if (divisorFound == false) { primeNumbers.add(i); }
		}
		System.out.println(primeNumbers);
		
		addProduct();
		updateProduct();
		deleteProduct();
		
		
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject searchQuery = new BasicDBObject();
		DBCursor cursor = table.find(searchQuery);

		while (cursor.hasNext()) {
			System.out.println(cursor.next());
		}
		
		return Response.status(200).entity("dbquery").build();
 
	}
	
	public Response addProduct() throws UnknownHostException {
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject document = new BasicDBObject();
		document.put("productName", "addp - test20");
		document.put("productCode", 123);
		document.put("releaseDate", new Date());
		document.put("description", "test20");
		document.put("price", 1230000);
		document.put("starRating", 4);
		table.insert(document);
		return Response.status(200).entity("dbquery").build(); 
	}
	
	public Response updateProduct() throws UnknownHostException {
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject query = new BasicDBObject();
		query.put("productName", "test1");

		BasicDBObject newDocument = new BasicDBObject();
		newDocument.put("productName", "test1-updated");
					
		BasicDBObject updateObj = new BasicDBObject();
		updateObj.put("$set", newDocument);

		table.update(query, updateObj);
		return Response.status(200).entity("dbquery").build(); 
	}
	
	public Response deleteProduct() throws UnknownHostException {
		Mongo mongo = new Mongo("localhost", 27017);
		DB db = mongo.getDB("local");
		DBCollection table = db.getCollection("products");
		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.put("productName", "test1");

		table.remove(searchQuery);
		return Response.status(200).entity("dbquery").build(); 
	}
	
	
 
}