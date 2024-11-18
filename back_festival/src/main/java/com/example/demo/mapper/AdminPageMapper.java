package com.example.demo.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;

@Mapper
public interface AdminPageMapper {
	List<BoardDTO> findReportedBoards();
	List<BoardDTO> findByReportcntGreaterThanEqual(int i);
	List<BoardDTO> getList(Criteria cri);
	long getTotal(Criteria cri);
	void updateReportCount(@Param("boardnum") Long boardnum, @Param("reportcnt") int reportcnt);
	Optional<BoardDTO> findById(long boardnum);
	void deleteList(BoardDTO boardDTO);
}
