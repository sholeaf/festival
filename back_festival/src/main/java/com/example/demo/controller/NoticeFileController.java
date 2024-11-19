package com.example.demo.controller;

import java.net.URLEncoder;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.service.NoticeFileService;



@RequestMapping("/api/notice/file/*")
@Controller
public class NoticeFileController {
	@Autowired
	private NoticeFileService nfservice;
	
	@GetMapping("thumbnail/{systemname}")
	public ResponseEntity<Resource> thumbnail(@PathVariable("systemname") String systemname) throws Exception {
		System.out.println("getTumbnailResource 호출됨: " + systemname);
		HashMap<String, Object> datas = nfservice.getTumbnailResource(systemname);
		System.out.println("데이타즈:"+datas);
		System.out.println("썸네일"+datas);
		String contentType = (String)datas.get("contentsType");
		Resource resource = (Resource)datas.get("resource");
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, contentType);
		return new ResponseEntity<Resource>(resource,headers,HttpStatus.OK);
	}
	
	@GetMapping("download/{systemname}")
	public ResponseEntity<Resource> download (@PathVariable("systemname") String systemname) throws Exception {
		HashMap<String, Object> result = nfservice.downloadFile(systemname);
		Resource resource = (Resource)result.get("resource");
		String orgname = (String)result.get("orgname");
		HttpHeaders headers = new HttpHeaders();
		String dwName = URLEncoder.encode(orgname,"UTF-8").replace("\\+", "%20");
		headers.setContentDisposition(ContentDisposition.builder("attachment").filename(dwName).build());
		
		return new ResponseEntity<Resource>(resource, headers, HttpStatus.OK);
	}
}
