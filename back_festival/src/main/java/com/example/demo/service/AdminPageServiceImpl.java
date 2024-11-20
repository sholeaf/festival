package com.example.demo.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.domain.PageDTO;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.mapper.AdminPageMapper;

@Service
public class AdminPageServiceImpl implements AdminPageService {
	@Autowired
	private AdminPageMapper apmapper;
	
	 @Override
	    public List<BoardDTO> getReportedBoards() {
	        try {
	            return apmapper.findByReportcntGreaterThanEqual(5);
	        } catch (Exception e) {
	            throw new RuntimeException("게시글 조회 중 오류 발생", e);
	        }
	    }

	@Override
	public List<BoardDTO> findByReportcntGreaterThanEqual(int reportCount) {
		return apmapper.findReportedBoards();
	}

	@Override
	public HashMap<String, Object> getList(Criteria cri) {
		HashMap<String, Object> result = new HashMap<>();
        List<BoardDTO> list = apmapper.getList(cri);

        long total = apmapper.getTotal(cri);
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (BoardDTO board : list) {
            LocalDateTime noticeregdate = LocalDateTime.parse(board.getBoardregdate(), dtf);
            Duration duration = Duration.between(noticeregdate, now);
            long elapsedHours = duration.toHours();
            
        }
        result.put("board", list);
        result.put("pageMaker", new PageDTO(total, cri));

        return result;
	}

	@Override
	@Transactional
	public void updateReportCount(Long boardnum, int reportcnt) {
		// 보고서 카운트가 유효한지 확인
	    if (reportcnt >= 0) {
	        // DB 업데이트: 카운트 값 업데이트
	        apmapper.updateReportCount(boardnum, reportcnt);
	        System.out.println("신고카운트 초기화: " + boardnum);
	        
	        // 삭제 조건: 해당 boardnum에 대한 보고서가 존재하는지 확인
	        int reportList = apmapper.getReportList(boardnum);
	        if (reportList > 0) {
	            // DB에서 리포트 리스트 삭제
	            apmapper.deleteReportList(boardnum);
	            System.out.println("신고목록 삭제: " + boardnum);
	        } else {
	            System.out.println("신고목록 없음: " + boardnum);
	        }
	    } else {
	        System.out.println("리스트없음: " + reportcnt);
	        throw new IllegalArgumentException("Report count must be a non-negative value.");
	    }
	}

	@Override
	public int deleteList(long boardnum) {
		Optional<BoardDTO> board = apmapper.findById(boardnum);
	    
	    // 게시글이 존재하면 삭제
	    if (board.isPresent()) {
	        apmapper.deleteList(board.get());  // 실제 삭제
	        return 1;  // 삭제 성공
	    } else {
	        return -1;
	    }
	}

	@Override
	public int replyreset(long replynum) {
		// TODO Auto-generated method stub
		return 0;
	}

	
	@Override
	public int deletereply(long boardnum) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public HashMap<String, Object> getReplyReportList(Criteria cri) {
		HashMap<String, Object> result = new HashMap<>();
        List<ReplyDTO> list = apmapper.getReplyList(cri);

        long total = apmapper.getTotal(cri);
        
        result.put("board", list);
        result.put("pageMaker", new PageDTO(total, cri));

        return result;
	}
}
