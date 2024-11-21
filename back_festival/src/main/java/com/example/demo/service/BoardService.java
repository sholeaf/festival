package com.example.demo.service;

import java.util.HashMap;
import java.util.List;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;

public interface BoardService {
	long write(BoardDTO board, String[] removeImages);
	BoardDTO getBoardbyBoardnum(long boardnum);
	void removeTemp(String[] removeData);
	HashMap<String, Object> getList(Criteria cri);
	void updateBoard (BoardDTO board, String[] removeImages);
	long remove(long boardnum);
	boolean reportReply(long replynum, String userid);
	boolean reportBoard(long boardnum, String userid);
	boolean like(long boardnum, String userid);
}
