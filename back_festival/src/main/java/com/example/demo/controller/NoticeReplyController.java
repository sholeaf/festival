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
		System.out.println("Received reply content: " + reply.getReplycontent());
	    System.out.println("Received noticenum: " + reply.getNoticenum());
		
		NoticeReplyDTO createReply = service.regist(reply);
		if(createReply != null) {
			return new ResponseEntity<>(createReply.getReplynum(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatusCode.valueOf(500));
		}
	}
	
	@GetMapping("/{noticenum}/{pagenum}")
	public ResponseEntity<NoticeReplyPageDTO> list (@PathVariable("noticenum")long noticenum,@PathVariable("pagenum")int pagenum){
		Criteria cri = new Criteria(pagenum, 5);
		return new ResponseEntity<>(service.getList(cri,noticenum),HttpStatus.OK);
	}
	
	@DeleteMapping("{replynum}")
	public ResponseEntity<Long> remove (@PathVariable("replynum") long replynum){
		return service.remove(replynum) ?
				new ResponseEntity<>(replynum,HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@PutMapping("{replynum}")
	public ResponseEntity<Long> modify(@PathVariable Long replynum, @RequestBody NoticeReplyDTO reply, HttpServletRequest req){
		reply.setReplynum(replynum);  // 클라이언트에서 받은 replynum을 요청 본문에 덮어 씌워줌

	    boolean isModified = service.modify(reply); // 수정 서비스 호출

	    return isModified ?
	        new ResponseEntity<>(replynum, HttpStatus.OK) : 
	        new ResponseEntity<>(-1L, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

