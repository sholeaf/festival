package com.example.demo.service;

import java.util.HashMap;
import java.util.List;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;

public interface AdminPageService {
	List<BoardDTO> findByReportcntGreaterThanEqual(int reportCount);
	List<BoardDTO> getReportedBoards();
	HashMap<String, Object> getList(Criteria cri);
	void updateReportCount(Long boardnum, int reportcnt);
	int deleteList(long boardnum);
	int replyreset(long replynum);
	int deletereply(long boardnum);
	HashMap<String, Object> getReplyReportList(Criteria cri);
	
}
