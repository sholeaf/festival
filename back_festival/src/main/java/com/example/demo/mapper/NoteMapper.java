package com.example.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoteCriteria;
import com.example.demo.domain.NoteDTO;

@Mapper
public interface NoteMapper {

	
	int insertNote(NoteDTO note);
	long getLastNum(String senduser);
	NoteDTO getnoteByNotenum(long notenum);
	long deleteNote(long notenum);
	List<NoteDTO> getList(NoteCriteria cri);
	long getTotal(NoteCriteria cri);
	void deleteById(Long notenum);
	void deleteByReceiveuser(String userid);

}
