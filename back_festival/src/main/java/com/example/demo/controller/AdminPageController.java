package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
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
    @DeleteMapping("/{boardnum}")
    public ResponseEntity<Long> deleteList(@PathVariable long boardnum){
    	if(apservice.deleteList(boardnum) != -1) {
			return new ResponseEntity<>(boardnum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    @GetMapping("/replyreportlist/{boardnum}")
    public ResponseEntity<HashMap<String, Object>> getReplyReportList(Criteria cri, @PathVariable("boardnum") int boardnum) {
        try {
            // 페이지 번호에 맞는 startrow 계산
            cri.setPagenum(boardnum);
            cri.setStartrow((cri.getPagenum() - 1) * cri.getAmount());
            
            System.out.println("Criteria: " + cri);

            // 서비스 메소드 호출하여 결과 가져오기
            HashMap<String, Object> result = apservice.getReplyReportList(cri);

            // 결과가 null이 아니고 비어있지 않으면 성공 응답
            if (result != null && !result.isEmpty()) {
                System.out.println("Result: " + result);
                return ResponseEntity.ok(result);
            } else {
                // 결과가 없을 경우 500 상태 코드 반환
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                                     
            }
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지와 상태 코드 반환
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                                 
        }
    }

    @PostMapping("/replyreset")
    public ResponseEntity<Long> replyreset(@RequestBody long replynum) {
        // replynum을 이용하여 신고 기록을 삭제하는 서비스 호출
        if (apservice.replyreset(replynum) != -1) {
            return new ResponseEntity<>(replynum, HttpStatus.OK);  // 성공 시 댓글 번호 반환
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);  // 실패 시 에러 응답
        }
    }
    @DeleteMapping("/{replynum}")
    public ResponseEntity<Long> deletereply(@PathVariable long replynum){
    	if(apservice.deletereply(replynum) != -1) {
			return new ResponseEntity<>(replynum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
    
}
