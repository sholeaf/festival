package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.service.AdminPageService;

@RestController
@RequestMapping("/api/adminpage/*")
public class AdminPageController {
	@Autowired
	private AdminPageService apservice;
	
	@GetMapping("{boardnum}")
	public ResponseEntity<HashMap<String, Object>> list(Criteria cri, @PathVariable("boardnum")int boardnum) {
		cri.setPagenum(boardnum);
		cri.setStartrow((cri.getPagenum() - 1) * cri.getAmount());  // 페이지 번호에 맞는 startrow 계산
	    System.out.println("Criteria: " + cri);
		
		HashMap<String, Object> result = apservice.getList(cri);
		if(result != null && !result.isEmpty()) {
			System.out.println("Result: " + result);
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@GetMapping("/reported")
	public ResponseEntity<?> getReportedBoards() {
	    try {
	        List<BoardDTO> boards = apservice.getReportedBoards();
	        return ResponseEntity.ok(boards);
	    } catch (Exception e) {
	        // 예외 발생 시 에러 메시지와 상태 코드 반환
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("서버 오류 발생: " + e.getMessage());
	    }
	}
	// 신고 횟수 초기화 API
    @PostMapping("/updateReportCount")
    public ResponseEntity<String> updateReportCount(@RequestBody Map<String, Object> request) {
        Long boardnum = Long.valueOf(request.get("boardnum").toString());
        int reportcnt = Integer.parseInt(request.get("reportcnt").toString());

        try {
            apservice.updateReportCount(boardnum, reportcnt);
            return ResponseEntity.ok("신고 횟수 리셋 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류: " + e.getMessage());
        }
    }
}
