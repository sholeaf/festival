package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.domain.PageDTO;
import com.example.demo.service.NoticeService;

import jakarta.servlet.http.HttpServletRequest;


@Controller
@RequestMapping("/api/notice/*")
public class NoticeController {
	
	@Autowired
	private NoticeService service;
	
	@GetMapping("list/{pagenum}")
	public ResponseEntity<HashMap<String, Object>> list(Criteria cri, @PathVariable("pagenum")int pagenum) {
		cri.setPagenum(pagenum);
		HashMap<String, Object> result = service.getList(cri);
		if(result != null) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@PostMapping("nwrite")
	public ResponseEntity<Long> nwrite(NoticeDTO notice, MultipartFile[] files, HttpServletRequest req) throws Exception{
		String userid = (String)req.getSession().getAttribute("loginUser");
		notice.setUserid(userid);
		long noticenum = service.regist(notice,files);
		if(noticenum != -1) {
			return new ResponseEntity<>(noticenum,HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
