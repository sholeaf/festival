package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.UserDTO;
import com.example.demo.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user/*")
public class UserController {
	
	@Autowired
	private UserService service;
	
	@GetMapping("checkId")
	public ResponseEntity<String> checkId(String userid) {
		if(service.checkId(userid)) {
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("X",HttpStatus.OK);
		}
	}
	
	@GetMapping("logout")
	public ResponseEntity<String> logout(HttpServletRequest req) {
		req.getSession().invalidate();
		return new ResponseEntity<String>("O",HttpStatus.OK);
	}
	
	@PostMapping("join")
	public ResponseEntity<String> join(@RequestBody UserDTO user, HttpServletResponse resp) {
		System.out.println(user);
		if(service.join(user)) {
			Cookie cookie = new Cookie("joinid", user.getUserid());
			cookie.setPath("/");
			cookie.setMaxAge(60);
			resp.addCookie(cookie);
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("ERROR : ????",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("login")
	public ResponseEntity<String> login(@RequestParam String userid, @RequestParam String userpw,HttpServletRequest req) {
		HttpSession session = req.getSession();
		if(service.login(userid, userpw)) {
			session.setAttribute("loginUser", userid);
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		return new ResponseEntity<String>("X",HttpStatus.OK);
	}
	
	@GetMapping("joinCheck")
	public ResponseEntity<String> joinCheck(HttpServletRequest req) {
		if(req.getHeader("Cookie") != null) {
			Cookie[] cookies = req.getCookies();
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("joinid")) {
					return new ResponseEntity<String>(cookie.getValue(),HttpStatus.OK);
				}
			}
		}
		return new ResponseEntity<String>("",HttpStatus.OK);
	}
	
	@GetMapping("loginCheck")
	public ResponseEntity<String> loginCheck(HttpServletRequest req){
		Object temp = req.getSession().getAttribute("loginUser");
		if(temp != null) {
			return new ResponseEntity<String>((String)temp,HttpStatus.OK);
		}
		return new ResponseEntity<String>("",HttpStatus.OK);
	}
}
