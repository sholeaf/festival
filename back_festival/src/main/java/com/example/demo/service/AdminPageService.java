package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyCriteria;
import com.example.demo.domain.ReplyDTO;

public interface AdminPageService {

	HashMap<String, Object> getList(Criteria cri);
	int deleteList(long boardnum);
	int replyreset(long replynum);
	int deletereply(long boardnum);
	HashMap<String, Object> getReplyReportList(Criteria cri);
	int boardreset(long boardnum);


	
}
