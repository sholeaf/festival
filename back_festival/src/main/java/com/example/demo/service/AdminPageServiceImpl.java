package com.example.demo.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BoardReportDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.domain.PageDTO;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyReportDTO;
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

        long total = apmapper.getListReporoTotal(cri);
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (BoardDTO board : list) {
            LocalDateTime noticeregdate = LocalDateTime.parse(board.getBoardregdate(), dtf);
            Duration duration = Duration.between(noticeregdate, now);
            long elapsedHours = duration.toHours();
            
        }
        result.put("board", list);
        result.put("pageMaker", new PageDTO(total, cri));
        System.out.println("신고게시글토탈"+total);
        return result;
	}


	@Override
	public int deleteList(long boardnum) {
	    // 게시글 찾기
	    Optional<BoardDTO> board = apmapper.findById(boardnum);
	    
	    if (board.isPresent()) {
	        // 게시글에 속한 댓글들 삭제
	        List<ReplyDTO> replies = apmapper.findRepliesByBoardnum(boardnum);
	        // 댓글이 있으면 댓글 삭제
	        if (replies != null && !replies.isEmpty()) {
	            for (ReplyDTO reply : replies) {
	                apmapper.deleteReplyList(reply);  // 댓글 삭제
	            }
	        }
	        // 게시글 삭제
	        apmapper.deleteList(board.get());      
	        return 1;  
	    } else {
	        return -1;  
	    }
	}

	@Override
	public int replyreset(long replynum) {
	    // 해당 replynum에 관련된 모든 레코드를 삭제하는 메서드 호출
	    int deletedCount = apmapper.deleteReplyReport(replynum);
	    
	    // 삭제된 레코드 수가 0보다 크면 성공, 아니면 실패
	    if (deletedCount > 0) {
	        return 1;
	    } else {
	        return -1;
	    }
	}

	
	@Override
	public int deletereply(long replynum) {
		 System.out.println("넘어오는 replynum: " + replynum); 
int deletedreply = apmapper.deleteReply(replynum);
	    
	    // 삭제된 레코드 수가 0보다 크면 성공, 아니면 실패
	    if (deletedreply > 0) {
	        return 1;
	    } else {
	        return -1;
	    }
	}

	@Override
	public HashMap<String, Object> getReplyReportList(Criteria cri) {
		System.out.println("cri : "+cri);
		HashMap<String, Object> result = new HashMap<>();
        List<ReplyDTO> list = apmapper.getReplyList(cri);

        long total = apmapper.getReplyReportTotal(cri);
        
        result.put("board", list);
        result.put("pageMaker", new PageDTO(total, cri));
        System.out.println("댓글신고게시글토탈"+total);
        return result;
	}

	@Override
	public int boardreset(long boardnum) {
	    int reportCount = apmapper.findBoardByReport(boardnum); // 신고 횟수 카운트
	    // 신고 내역이 있다면 삭제
	    if (reportCount > 0) {
	        apmapper.deleteReportList(boardnum);  // 해당 boardnum에 대한 신고 내역 삭제
	        return 1;  // 삭제 성공
	    } else {
	        return -1;  // 신고 내역이 없으면 실패
	    }
	}


	
}
