package com.example.demo.service;

import java.io.UnsupportedEncodingException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public interface MailService {

	// 메일 내용 작성
	MimeMessage creatMessage(String to) throws MessagingException, UnsupportedEncodingException;
	
	// 랜덤 인증코드 작성
	String createKey();
	
	// 메일 발송
	String sendSimpleMessage(String to) throws Exception;
}
