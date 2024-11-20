package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyPageDTO;
import com.example.demo.service.ReplyService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/reply/*")
public class ReplyController {
	
	@Autowired
	private ReplyService rservice;
	
	@PostMapping("regist")
	public ResponseEntity<Long> regist(@RequestBody ReplyDTO reply){
		ReplyDTO createdReply = rservice.regist(reply);
		if(createdReply != null) {
			return new ResponseEntity<>(createdReply.getReplynum(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatusCode.valueOf(500));
		}
	}
	
	@GetMapping("/{boardnum}/{pagenum}")
	public ResponseEntity<ReplyPageDTO> list(
			@PathVariable("boardnum") long boardnum,
			@PathVariable("pagenum") int pagenum){
		Criteria cri = new Criteria(pagenum,5);
		
		return new ResponseEntity<>(rservice.getList(cri,boardnum),HttpStatus.OK);
	}
	
	@DeleteMapping("/{replynum}")
	public ResponseEntity<Long> remove(@PathVariable("replynum") long replynum) {
		return rservice.removeReply(replynum) ? 
				new ResponseEntity<>(replynum,HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@PutMapping("{replynum}")
	public ResponseEntity<Long> modify(@RequestBody ReplyDTO reply) {
		return rservice.updateReply(reply) ? 
				new ResponseEntity<>(reply.getReplynum(),HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
