package com.example.demo.service;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoteDTO;
import com.example.demo.domain.PageDTO;
import com.example.demo.mapper.NoteMapper;

@Service
public class NoteServiseImpl implements NoteService {
	
	@Autowired
	private NoteMapper ntmapper;

	@Override
	public HashMap<String, Object> getList(Criteria cri) {
		HashMap<String, Object> result = new HashMap<>();
		List<NoteDTO> list = ntmapper.getList(cri);
		long total = ntmapper.getTotal(cri);
		
		result.put("note", list);
		result.put("pageMaker", new PageDTO(total, cri));
		return result;
	}

	@Override
	public long regist(@RequestBody NoteDTO note) throws Exception {
		try {
	        int regist = ntmapper.insertNote(note); 
	        System.out.println("답장눌렀을때결과"+regist);
	        if (regist > 0) {
	            return note.getNotenum();
	        } else {
	            return -1; 
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return -1;
	    }
	}

	@Override
	public HashMap<String, Object> getdetail(long notenum, String loginUser) {
		HashMap<String, Object> result = new HashMap<>();
		NoteDTO note = ntmapper.getnoteByNotenum(notenum);
		
		result.put("note", note);
		return result;
	}

	@Override
	public boolean remove(long notenum) {
		return ntmapper.deleteNote(notenum) == 1;	
	}

	@Override
	public long receive(@RequestBody NoteDTO note) {
		try {
	        // 답장 데이터를 DB에 저장
	        int result = ntmapper.insertNote(note); // SQL 쿼리 실행
	        System.out.println("답장눌렀을때결과"+result);
	        if (result > 0) {
	            return note.getNotenum(); // 생성된 노트 번호 반환
	        } else {
	            return -1; // 실패 시
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return -1;
	    }
	}

	@Override
	public void deleteMultipleNotes(List<Long> notenums) {
		for (Long notenum : notenums) {
            ntmapper.deleteById(notenum);
        }
		
	}
	
	
}
