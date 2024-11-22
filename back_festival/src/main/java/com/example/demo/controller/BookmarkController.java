package com.example.demo.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.BookmarkDTO;
import com.example.demo.service.BookmarkService;

@RestController
@RequestMapping("/api/bookmark/*")
public class BookmarkController {
	
	@Autowired
	private BookmarkService bmservice;
	
	@GetMapping("checkBookmark")
	public ResponseEntity<ArrayList<String>> checBookmark(String userid) {
		System.out.println(" 요청 들어옴 !");
		ArrayList<String> list = bmservice.getBookmark(userid);
		System.out.println(list);
		return new ResponseEntity<ArrayList<String>>(list,HttpStatus.OK);
	}
	
	@PostMapping("addBookmark")
	public ResponseEntity<String> addBookmark(@RequestBody BookmarkDTO bmDto){
		System.out.println("추가 요청 들어옴 !");
		System.out.println("content id : "+bmDto.getContentid());
		System.out.println("user id : "+bmDto.getUserid());
		if(bmservice.addBookmark(bmDto.getUserid(), bmDto.getContentid())) {
			return new ResponseEntity<String>("o",HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("x",HttpStatus.OK);
		}
	}
	
	@DeleteMapping("removeBookmark")
	public ResponseEntity<String> removeBookmark(String userid, String contentid){
		System.out.println("삭제 요청 들어옴 !");
		System.out.println("content id :  "+ contentid);
		if(bmservice.removeBookmark(userid, contentid)) {
			return new ResponseEntity<String>("o",HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("x",HttpStatus.OK);
		}
	}
}
