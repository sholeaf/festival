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
		BoardDTO board =  bmapper.getBoardbyBoardnum(boardnum);
		board.setLikeCnt(bmapper.likeCnt(boardnum));
		System.out.println(boardnum+": "+board.getLikeCnt());
		return board;
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
		for(BoardDTO board : list) {
			board.setLikeCnt(bmapper.likeCnt(board.getBoardnum()));
			board.setReplyCnt(bmapper.replyCnt(board.getBoardnum()));
		}
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
		rmapper.deleteAllReplyByBoardnum(boardnum);
		if(bmapper.deleteBoard(boardnum) == 1) {
			return boardnum;
		}
		return -1;
	}

	@Override
	public boolean reportReply(long replynum, String userid) {
		if(!bmapper.searchReplyReport(replynum, userid)) {
			return bmapper.reportReply(replynum, userid);
		}
		else return false;
	}

	@Override
	public boolean reportBoard(long boardnum, String userid) {
		if(!bmapper.searchBoardReport(boardnum, userid)) {
			return bmapper.reportBoard(boardnum, userid);
		}
		else return false;
	}

	@Override
	public boolean like(long boardnum, String userid) {
		if(!bmapper.searchLike(boardnum, userid)) {
			return bmapper.like(boardnum, userid);
		}
		else {
			return !bmapper.deleteLike(boardnum, userid);
		}
	}

	@Override
	public boolean checkLike(long boardnum, String userid) {
		return bmapper.searchLike(boardnum, userid);
	}
}
