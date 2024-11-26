package com.example.demo.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;

@Mapper
public interface BoardMapper {
	int insertBoard(BoardDTO board);
	long getLastNum(String userid);
	BoardDTO getBoardbyBoardnum(long boardnum);
	List<BoardDTO> getList(Criteria cri);
	long getTotal(Criteria cri);
	void updateBoard(BoardDTO board);
	int deleteBoard(long boardnum);
	boolean reportReply(long replynum, String userid);
	boolean reportBoard(long boardnum, String userid);
	boolean searchBoardReport(long boardnum, String userid);
	boolean searchReplyReport(long replynum, String userid);
	boolean like(long boardnum, String userid);
	boolean deleteLike(long boardnum, String userid);
	boolean searchLike(long boardnum, String userid);
	int likeCnt(long boardnum);
	int replyCnt(long boardnum);
	List<BoardDTO> getListByUserid(String userid);
	ArrayList<BoardDTO> getBestBoard(String lastMonth, String toDay);
}
