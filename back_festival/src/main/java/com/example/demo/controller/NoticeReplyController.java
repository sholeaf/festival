package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeReplyDTO;
import com.example.demo.domain.NoticeReplyPageDTO;
import com.example.demo.service.NoticeReplyService;

import jakarta.servlet.http.HttpServletRequest;

@RequestMapping("/api/nreply/*")
@Controller
public class NoticeReplyController {
	
	@Autowired
	private NoticeReplyService service;

	@PostMapping("regist")
	public ResponseEntity<Long> regist(@RequestBody NoticeReplyDTO reply){
		NoticeReplyDTO createReply = service.regist(reply);
		if(createReply != null) {
			return new ResponseEntity<>(createReply.getReplynum(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatusCode.valueOf(500));
		}
	}
	
	@GetMapping("/{boardnum}/{pagenum}")
	public ResponseEntity<NoticeReplyPageDTO> list (@PathVariable("boardnum")long boardnum,@PathVariable("pagenum")int pagenum){
		Criteria cri = new Criteria(pagenum, 5);
		return new ResponseEntity<>(service.getList(cri,boardnum),HttpStatus.OK);
	}
	
	@DeleteMapping("{replynum}")
	public ResponseEntity<Long> remove (@PathVariable("replynum") long replynum){
		return service.remove(replynum) ?
				new ResponseEntity<>(replynum,HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@PutMapping("{replynum")
	public ResponseEntity<Long> modify(@RequestBody NoticeReplyDTO reply, HttpServletRequest req){
		return service.modify(reply) ?
				new ResponseEntity<>(reply.getReplynum(),HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

