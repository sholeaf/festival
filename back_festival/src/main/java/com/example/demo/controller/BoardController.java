package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BoardWriteDTO;
import com.example.demo.domain.Criteria;
import com.example.demo.service.BoardService;

@RestController
@RequestMapping("/api/board/*")
public class BoardController {
	
	@Autowired
	private BoardService bservice;
	
	@GetMapping("list/{pagenum}")
	public ResponseEntity<HashMap<String, Object>> getList(Criteria cri, @PathVariable("pagenum")int pagenum){
		cri.setPagenum(pagenum);
		HashMap<String, Object> result = bservice.getList(cri);
		if(result != null) {
			return new ResponseEntity<>(result,HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("write")
	public ResponseEntity<Long> write(@RequestBody BoardWriteDTO data){
		BoardDTO board = data.getBoard();
		String[] removeImages = data.getRemoveImages();
		long boardnum = bservice.write(board, removeImages);
		return new ResponseEntity<Long>(boardnum,HttpStatus.OK);
	}
	
	@PostMapping("canselWrite")
	public void canselWrite(@RequestBody String[] tempImages) {
		bservice.removeTemp(tempImages);
	}
	
	@GetMapping("{boardnum}")
	public ResponseEntity<BoardDTO> get(@PathVariable("boardnum") long boardnum){
		BoardDTO board = bservice.getBoardbyBoardnum(boardnum);
		System.out.println(board.getTag());
		return new ResponseEntity<BoardDTO>(board, HttpStatus.OK);
	}
	
	@PutMapping("modify")
	public void modify(@RequestBody BoardWriteDTO data) {
		BoardDTO board = data.getBoard();
		String[] removeImages = data.getRemoveImages();
		bservice.updateBoard(board, removeImages);
	}
	@DeleteMapping("{boardnum}")
	public ResponseEntity<Long> remove(@PathVariable("boardnum") long boardnum, 
			@RequestParam(value = "useImages[]", required = false) String[] useImages){
		if(useImages != null) {
			bservice.removeTemp(useImages);
		}
		if(bservice.remove(boardnum) != -1) {
			return new ResponseEntity<>(boardnum, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/reportBoard/{boardnum}")
	public ResponseEntity<Boolean> reportBoard(@PathVariable long boardnum, @RequestParam String userid){
		if(bservice.reportBoard(boardnum, userid)) {
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
		else return new ResponseEntity<>(false, HttpStatus.OK);
	}
	@PostMapping("/reportReply/{replynum}")
	public ResponseEntity<Boolean> reportReply(@PathVariable long replynum, @RequestParam String userid){
		if(bservice.reportReply(replynum, userid)) {
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
		else return new ResponseEntity<>(false, HttpStatus.OK);
	}
	@PostMapping("/like/{boardnum}")
	public ResponseEntity<Boolean> like(@PathVariable long boardnum, @RequestParam String userid){
		if(bservice.like(boardnum, userid)) {
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
		else return new ResponseEntity<>(false, HttpStatus.OK);
	}
	@GetMapping("/like/{boardnum}")
	public ResponseEntity<Boolean> checkLike(@PathVariable long boardnum, @RequestParam String userid){
		return new ResponseEntity<Boolean>(bservice.checkLike(boardnum, userid), HttpStatus.OK);
	}
}
