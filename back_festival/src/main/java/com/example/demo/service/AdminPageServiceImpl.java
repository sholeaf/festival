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
		// 전달된 값 확인
	    System.out.println("BoardNum: " + boardnum + ", ReportCnt: " + reportcnt);
	    
	    // DB 업데이트
	    apmapper.updateReportCount(boardnum, reportcnt);
	    
	    // 성공적으로 업데이트 되었는지 다시 확인
	    System.out.println("Successfully updated report count to " + reportcnt);
		apmapper.updateReportCount(boardnum, reportcnt);
		
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
}
