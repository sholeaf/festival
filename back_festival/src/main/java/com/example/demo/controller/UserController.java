package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.UserDTO;
import com.example.demo.domain.UserInfoDTO;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/user/*")
public class UserController {
	
	@Autowired
	private UserService service;
	
	@GetMapping("checkId")
	public ResponseEntity<String> checkId(@RequestParam String userid) {
		if(service.checkId(userid)) {
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("X",HttpStatus.OK);
		}
	}
	
	@GetMapping("userInfo")
	public ResponseEntity<HashMap<String, Object>> userInfo(@RequestParam String userid) {
		System.out.println(userid);
		HashMap<String, Object> result = service.getUser(userid);
		if(result != null) {
			return new ResponseEntity<HashMap<String, Object>>(result ,HttpStatus.OK);
		}
		else {
			return new ResponseEntity<HashMap<String, Object>>(result ,HttpStatus.OK);
		}
	}
	
	@GetMapping("getUser")
	public ResponseEntity<UserDTO> getUser(@RequestParam String email) {
		UserDTO user = service.getUserid(email);
		if(user != null) {
			return new ResponseEntity<UserDTO>(user,HttpStatus.OK);
		}
		else {
			return new ResponseEntity<UserDTO>(user,HttpStatus.OK);
		}
	}
	
	@GetMapping("logout")
	public ResponseEntity<String> logout(HttpServletRequest req) {
		req.getSession().invalidate();
		return new ResponseEntity<String>("O",HttpStatus.OK);
	}
	
	@PostMapping("join")
	public ResponseEntity<String> join(@RequestBody Map<String, Object> userData, HttpServletResponse resp) {
	    // Map으로 받아서 user와 userInfo 분리하기
	    UserDTO user = new ObjectMapper().convertValue(userData.get("user"), UserDTO.class);
	    UserInfoDTO userInfo = new ObjectMapper().convertValue(userData.get("userInfo"), UserInfoDTO.class);

		if(service.join(user, userInfo)) {
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
	
	@PutMapping("modify")
	public ResponseEntity<String> modify(@RequestBody Map<String, UserDTO> temp) {
		UserDTO user = temp.get("user");
		System.out.println(user);
		if(service.modifyUser(user)) {
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		return new ResponseEntity<String>("X",HttpStatus.OK);
	}
	
	@PutMapping("pwModify")
	public ResponseEntity<String> pwModify(@RequestBody UserDTO user, HttpServletRequest req) {
		String userid = user.getUserid();
		String userpw = user.getUserpw();
		HttpSession session = req.getSession();
		String loginUser = (String)session.getAttribute("loginUser");
		if(loginUser.equals(userid)) {
			if(service.modifyPw(userid, userpw)) {
				return new ResponseEntity<String>("O",HttpStatus.OK);
			}
		}
		return new ResponseEntity<String>("X",HttpStatus.OK);
	}
	
	@PutMapping("profileModify")
	public ResponseEntity<String> profileModify(@RequestParam String userid, @RequestParam(required = false) MultipartFile file, @RequestParam String deleteFile) {
		if (file != null && !file.isEmpty()) {
	        // 파일이 전달된 경우 처리
	        System.out.println("File received: " + file.getOriginalFilename());
	        System.out.println("deleteFile : "+deleteFile);
	        System.out.println("user : " + userid);
	        // 파일 저장 또는 다른 로직 처리
	        if(service.profileModify(userid, file, deleteFile) == 1) {
	        	return new ResponseEntity<String>("O",HttpStatus.OK);
	        }
	        else {
	        	return new ResponseEntity<String>("X",HttpStatus.OK);
	        }
	    } else {
	        // 파일이 없을 경우 처리
	        System.out.println("No file uploaded.");
	        System.out.println("deleteFile : "+deleteFile);
	        System.out.println("user : " + userid);
	        // 기본 프로필 유지 또는 파일 없이 다른 업데이트 처리
	        if(service.defaultProfile(userid, deleteFile) == 1) {
	        	return new ResponseEntity<String>("O",HttpStatus.OK);
	        }
	        return new ResponseEntity<String>("X",HttpStatus.OK);
	    }
	}
	
	@DeleteMapping("delete")
	public ResponseEntity<String> deleteUser(@RequestParam String userid, HttpServletRequest req) {
		if(service.deleteUser(userid) == 1) {
			HttpSession session = req.getSession();
			session.removeAttribute("loginUser");
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		return new ResponseEntity<String>("X",HttpStatus.OK);
	}
	
	@GetMapping("list")
	public ResponseEntity<HashMap<String, Object>> getList(@RequestParam String userid) {
		HashMap<String, Object> result = service.getList(userid);
		return new ResponseEntity<HashMap<String, Object>>(result,HttpStatus.OK);
	}
	
	@PutMapping("infoModify")
	public ResponseEntity<String> infoModify(@RequestBody UserInfoDTO userInfo) {
		if(service.updateInfo(userInfo) == 1) {
			return new ResponseEntity<String>("O",HttpStatus.OK);
		}
		return new ResponseEntity<String>("X",HttpStatus.OK);
	}
}
