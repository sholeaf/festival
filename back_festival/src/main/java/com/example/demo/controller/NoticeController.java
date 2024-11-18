package com.example.demo.controller;


import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.domain.UserDTO;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.NoticeService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/notice/*")
public class NoticeController {
	
	@Autowired
	private NoticeService service;
	
	@Autowired
	private UserMapper umapper;
	
	@GetMapping("list/{noticenum}")
	public ResponseEntity<HashMap<String, Object>> list(Criteria cri, @PathVariable("noticenum")int noticenum) {
		cri.setPagenum(noticenum);
		cri.setStartrow((cri.getPagenum() - 1) * cri.getAmount());  // 페이지 번호에 맞는 startrow 계산
	    System.out.println("Criteria: " + cri);
		
		HashMap<String, Object> result = service.getList(cri);
		if(result != null && !result.isEmpty()) {
			System.out.println("Result: " + result);
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
		System.out.println("공지글쓰기"+notice);
		if(noticenum != -1) {
			return new ResponseEntity<>(noticenum,HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@GetMapping("/{noticenum}")
	public ResponseEntity<HashMap<String, Object>> nget(@PathVariable("noticenum") long noticenum, HttpServletRequest req) {
	    HttpSession session = req.getSession();
	    String loginUser = (String) session.getAttribute("loginUser");

	    // 디버깅용 로그
	    System.out.println("Fetching details for noticenum: " + noticenum + " by user: " + loginUser);

	    HashMap<String, Object> result = service.getDetail(noticenum, loginUser);
	    if (result.get("notice") != null) {
	        return new ResponseEntity<HashMap<String, Object>>(result, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<HashMap<String, Object>>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	

	@PutMapping("{noticenum}")
	public ResponseEntity<Long> nmodify(NoticeDTO notice, MultipartFile[] files, String[] deleteFiles) throws Exception {
		long noticenum = service.nmodify(notice,files,deleteFiles);
		if(noticenum != -1) {
			return new ResponseEntity<>(noticenum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("{noticenum}")
	public ResponseEntity<Long> remove (@PathVariable("noticenum") long noticenum){
		if(service.remove(noticenum) != -1) {
			return new ResponseEntity<>(noticenum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@GetMapping("checkadmin")
	public Response checkAdmin(HttpServletRequest req) {
		//세션에 로그인한 유저 아이디 가져오기
		String loggedInUserId = (String) req.getSession().getAttribute("loginUser");
		
		System.out.println("Logged in user ID: " + loggedInUserId);
		//DB에서 해당 사용자 정보를 가져오기
        UserDTO user = umapper.getUserByUserid(loggedInUserId);
        //사용자가 'admin'이라면, 관리자로 처리
        boolean isAdmin = (user != null && "admin".equals(user.getUserid()));
        
        return new Response(isAdmin);
        
	}
	// Response 클래스 (결과를 전달할 DTO)
    public static class Response {
 
    	private boolean isAdmin;

        public Response(boolean isAdmin) {
            this.isAdmin = isAdmin;
        }
        public boolean isAdmin() {
            return isAdmin;
        }
        public void setAdmin(boolean isAdmin) {
            this.isAdmin = isAdmin;
        }
    }
}
