package com.example.demo.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoteCriteria;
import com.example.demo.domain.NoteDTO;

public interface NoteService {

	long regist(@RequestBody NoteDTO note) throws Exception;
	HashMap<String, Object> getdetail(long notenum, String loginUser);
	boolean remove(long notenum);
	long receive(@RequestBody NoteDTO note);
	void deleteMultipleNotes(List<Long> notenums);
	HashMap<String, Object> getList(NoteCriteria cri);

}
