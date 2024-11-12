package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.MailService;

@RestController
@RequestMapping("/api/mail/*")
public class MailController {

	@Autowired
	private MailService service;
	
	@PostMapping("confirm.json")
	public ResponseEntity<String> mailConfirm(@RequestParam String email) throws Exception{
		System.out.println("사용자가 요청한 이메일 : " + email);
		
		String code = service.sendSimpleMessage(email);
		System.out.println("사용자에게 발송한 인증코드 ==> " + code);

		return new ResponseEntity<String>(code,HttpStatus.OK);
	}
}
