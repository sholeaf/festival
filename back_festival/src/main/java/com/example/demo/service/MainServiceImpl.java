package com.example.demo.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.BookmarkDTO;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.mapper.BoardMapper;
import com.example.demo.mapper.BookmarkMapper;
import com.example.demo.mapper.NoticeMapper;

@Service
public class MainServiceImpl implements MainService {

	@Autowired
	private BoardMapper bmapper;

	@Autowired
	private BookmarkMapper bkmapper;

	@Autowired
	private NoticeMapper nmapper;

	@Override
	public ArrayList<BoardDTO> getBestBoard() {
		return bmapper.getBestBoard();
	}

	@Override
	public ArrayList<BookmarkDTO> getBookmarkList(String loginUser) {
		return bkmapper.getBookmarkList(loginUser);
	}

	@Override
	public ArrayList<NoticeDTO> getNotice() {
		return nmapper.getNotice();
	}

}
