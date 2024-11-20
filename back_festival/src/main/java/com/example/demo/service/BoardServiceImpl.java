package com.example.demo.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.domain.PageDTO;
import com.example.demo.domain.ReplyDTO;
import com.example.demo.mapper.BoardMapper;
import com.example.demo.mapper.ReplyMapper;

@Service
public class BoardServiceImpl implements BoardService {
	@Value("${file.dir}")
	private String saveFolder;
	@Autowired
	private BoardMapper bmapper;
	@Autowired
	private ReplyMapper rmapper;
	
	@Override
	public long write(BoardDTO board, String[] removeImages) {
		for(String systemname : removeImages) {
			File file = new File(saveFolder, systemname);
			file.delete();
		}
		if(bmapper.insertBoard(board) != 1) {
			return -1;
		}
		long boardnum = bmapper.getLastNum(board.getUserid());
		return boardnum;
	}

	@Override
	public BoardDTO getBoardbyBoardnum(long boardnum) {
		return bmapper.getBoardbyBoardnum(boardnum);
	}

	@Override
	public void removeTemp(String[] removeData) {
		for(String systemname : removeData) {
			File file = new File(saveFolder, systemname);
			file.delete();
		}
	}
	
	@Override
	public HashMap<String, Object> getList(Criteria cri) {
		HashMap<String, Object> result = new HashMap<>();
		List<BoardDTO> list = bmapper.getList(cri);
		long total = bmapper.getTotal(cri);
		result.put("list",list);
		result.put("pageMaker", new PageDTO(total, cri));
		return result;
	}

	@Override
	public void updateBoard(BoardDTO board, String[] removeImages) {
		for(String systemname : removeImages) {
			File file = new File(saveFolder, systemname);
			file.delete();
		}
		bmapper.updateBoard(board);
	}

	@Override
	public long remove(long boardnum) {
		if(bmapper.deleteBoard(boardnum) == 1) {
			return boardnum;
		}
		return -1;
	}
}
