package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoteDTO;
import com.example.demo.mapper.NoteMapper;
import com.example.demo.service.NoteService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/note/*")
public class NoteController {
	@Autowired
	private NoteService ntservice;


	@GetMapping("list/{notenum}")
	@ResponseBody
	public ResponseEntity<HashMap<String, Object>> getList(Criteria cri, @PathVariable("notenum") int notenum) {
		HashMap<String, Object> response = new HashMap<>();
	    try {
	        cri.setPagenum(notenum);
	        cri.setStartrow((cri.getPagenum() - 1) * cri.getAmount());
	        HashMap<String, Object> result = ntservice.getList(cri);

	        if (result == null || result.isEmpty()) {
	            response.put("error", "데이터가 없습니다.");
	            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
	        }

	        return new ResponseEntity<>(result, HttpStatus.OK);
	    } catch (Exception e) {
	        // 예외 발생 시 로그 기록 및 오류 메시지 반환
	        response.put("error", "서버 처리 중 오류가 발생했습니다.");
	        response.put("message", e.getMessage());
	        e.printStackTrace();  // 서버 로그를 위한 스택 트레이스 출력
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@PostMapping("write")
	public ResponseEntity<Long> write(@RequestBody NoteDTO note, HttpServletRequest req) throws Exception {
		String userid = (String) req.getSession().getAttribute("loginUser");
		note.setSenduser(userid);
		long notenum = ntservice.regist(note);
		System.out.println("처음쪽찌쓸때내용"+note);
		String flag = "note";
		if (notenum != -1) {
			return new ResponseEntity<>(notenum, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@PostMapping("receive")
	public ResponseEntity<Long> receive (@RequestBody NoteDTO note, HttpServletRequest req) throws Exception{
		String userid = (String) req.getSession().getAttribute("loginUser");
		note.setSenduser(userid);
		long notenum = ntservice.receive(note);
		System.out.println("쪽지넘어오는 자료"+note);
		if (notenum != -1) {
			return new ResponseEntity<>(notenum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{notenum}")
	public ResponseEntity<HashMap<String, Object>> noteget(@PathVariable("notenum") long notenum,
			HttpServletRequest req) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");

		// 디버깅
		System.out.println("noteget notenum:" + notenum + "by user:" + loginUser);

		HashMap<String, Object> result = ntservice.getdetail(notenum, loginUser);
		if (result.get("note") != null) {
			System.out.println("getdetail result: " + result);
			return new ResponseEntity<HashMap<String, Object>>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<HashMap<String, Object>>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@DeleteMapping("{notenum}")
	public ResponseEntity<Long> remove (@PathVariable("notenum")long notenum){
		System.out.println("notenum??"+notenum);
		return ntservice.remove(notenum)?
				new ResponseEntity<>(notenum,HttpStatus.OK) :
				new ResponseEntity<>(-1l,HttpStatus.INTERNAL_SERVER_ERROR);
		
	}
	@DeleteMapping("/delete-multiple")
    public ResponseEntity<String> deleteMultipleNotes(@RequestBody Map<String, List<Long>> request) {
        List<Long> notenums = request.get("notenums");

        if (notenums == null || notenums.isEmpty()) {
            return ResponseEntity.badRequest().body("삭제할 쪽지가 없습니다.");
        }

        try {
            ntservice.deleteMultipleNotes(notenums);
            return ResponseEntity.ok("선택된 쪽지가 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
        }
    }
}