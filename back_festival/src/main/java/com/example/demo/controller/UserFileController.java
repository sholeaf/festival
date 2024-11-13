package com.example.demo.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.NoticeFileService;

@RestController
@RequestMapping("/api/user/file/*")
public class UserFileController {
	
	@Autowired
	private NoticeFileService nfservice;
	
	@GetMapping("thumbnail/{systemname}")
	public ResponseEntity<Resource> thumbnail(@PathVariable("systemname") String systemname) throws Exception {
		System.out.println("getTumbnailResource 호출됨: " + systemname);
		HashMap<String, Object> datas = nfservice.getTumbnailResource(systemname);
		System.out.println("썸네일"+datas);
		String contentType = (String)datas.get("contentsType");
		Resource resource = (Resource)datas.get("resource");
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, contentType);
		return new ResponseEntity<Resource>(resource,headers,HttpStatus.OK);
	}
}
