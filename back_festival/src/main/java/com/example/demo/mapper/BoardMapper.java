package com.example.demo.mapper;

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
}
