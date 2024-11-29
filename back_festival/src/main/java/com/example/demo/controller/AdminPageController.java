package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	   
		// 여기에서 existsCondition을 설정
	    cri.setExistsCondition(true);  // existsCondition을 true로 설정 (조건에 맞게 수정)
	    
	    
		System.out.println("List Controller Criteria: " + cri);
		
		HashMap<String, Object> result = apservice.getList(cri);
		if(result != null && !result.isEmpty()) {
			System.out.println("List Controller Result: " + result);
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	// 신고 횟수 초기화 API
    @DeleteMapping("/boardReportreset/{boardnum}")
    public ResponseEntity<Long> boardReportreset(@PathVariable long boardnum) {
    	if (apservice.boardreset(boardnum) != -1) {
            return new ResponseEntity<>(boardnum, HttpStatus.OK);  // 성공 시 댓글 번호 반환
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);  // 실패 시 에러 응답
        }
    }
    //신고글 삭제
    @DeleteMapping("/boardremove/{boardnum}")
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
            cri.setExistsCondition(true);
            System.out.println("Report List Controller Criteria: " + cri);

            // 서비스 메소드 호출하여 결과 가져오기
            HashMap<String, Object> result = apservice.getReplyReportList(cri);

            // 결과가 null이 아니고 비어있지 않으면 성공 응답
            if (result != null && !result.isEmpty()) {
                System.out.println("Report List Controller Result: " + result);
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

    @DeleteMapping("/replyreset/{replynum}")
    public ResponseEntity<Long> replyreset(@PathVariable long replynum) {
        if (apservice.replyreset(replynum) != -1) {
            return new ResponseEntity<>(replynum, HttpStatus.OK);  
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);  
        }
    }
    //신고된 댓글 삭제 (reply_report 데이터 삭제)
    @DeleteMapping("/replyremove/{replynum}")
    public ResponseEntity<Long> deletereply(@PathVariable long replynum){
    	if(apservice.deletereply(replynum) != -1) {
			return new ResponseEntity<>(replynum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

}