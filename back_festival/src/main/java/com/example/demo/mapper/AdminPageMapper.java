package com.example.demo.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BoardReportDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.domain.ReplyReportDTO;

@Mapper
public interface AdminPageMapper {
	List<BoardDTO> getList(Criteria cri);
	long getListReporoTotal(Criteria cri);
	Optional<BoardDTO> findById(long boardnum);
	void deleteList(BoardDTO boardDTO);
	void deleteReplyList(ReplyDTO replyDTO);
	List<ReplyDTO> findRepliesByBoardnum(long boardnum);
	int findBoardByReport(long boardnum);
	void deleteReportList(long boardnum);

}