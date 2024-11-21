package com.example.demo.controller;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmark/*")
public class BookmarkController {
	@GetMapping("checkBookmark")
	public ResponseEntity<ArrayList<String>> checBookmark(String userid) {
		
		
		return null;
	}
}
