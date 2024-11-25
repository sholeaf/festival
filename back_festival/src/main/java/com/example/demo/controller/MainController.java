package com.example.demo.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BookmarkDTO;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.service.MainService;

@RestController
@RequestMapping("/api/main/*")
public class MainController {
	
	@Autowired
	private MainService mservice;
	
	
	@GetMapping("bookmark")
	public ResponseEntity<ArrayList<BookmarkDTO>> getBookmark(String loginUser){
		System.out.println(loginUser);
		ArrayList<BookmarkDTO> list =  mservice.getBookmark(loginUser);
		System.out.println("bookmark : "+list);
		return new ResponseEntity<ArrayList<BookmarkDTO>>(list,HttpStatus.OK);
	}
	
	@GetMapping("notice")
	public ResponseEntity<ArrayList<NoticeDTO>> getNotice(){
		ArrayList<NoticeDTO> list = mservice.getNotice();
		System.out.println("notice : "+list);
		return new ResponseEntity<ArrayList<NoticeDTO>>(list,HttpStatus.OK);
	}
}
