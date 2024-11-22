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
	List<BoardDTO> findReportedBoards();
	List<BoardDTO> findByReportcntGreaterThanEqual(int i);
	List<BoardDTO> getList(Criteria cri);
	long getListReporoTotal(Criteria cri);
	Optional<BoardDTO> findById(long boardnum);
	void deleteList(BoardDTO boardDTO);
	int getReportList(Long boardnum);
	List<ReplyDTO> getReplyList(Criteria cri);
	void deleteReplyList(ReplyDTO replyDTO);
	Optional<ReplyDTO> findReplyById(long replynum);
	List<ReplyDTO> findRepliesByBoardnum(long boardnum);
	Optional<ReplyReportDTO> findByreplynum(long replynum);
	int deleteReplyReport(long replynum);
	int findBoardByReport(long boardnum);
	void deleteReportList(long boardnum);
	int deleteReply(long replynum);
	long getReplyReportTotal(Criteria cri);
}
