package com.example.demo.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.FileService;

@RestController
@RequestMapping("/api/file/*")
public class FileController {
	
	@Autowired
	private FileService service;
	
	@PostMapping("saveImage")
	public String saveImage(@RequestParam("file") MultipartFile file) {
		return service.saveImage(file);
	}
	
	@GetMapping("thumbnail")
	public ResponseEntity<Resource> tumbnail(String systemname){
		HashMap<String, Object> datas = service.getTumbnailResource(systemname);
		String contentType = (String)datas.get("contentType");
		Resource resource = (Resource) datas.get("resource");
		
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, contentType);
		return new ResponseEntity<Resource>(resource, headers, HttpStatus.OK);
	}
	

}
