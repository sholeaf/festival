package com.example.demo.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.BookmarkDTO;
import com.example.demo.mapper.BookmarkMapper;

@Service
public class BookmarkServiceImpl implements BookmarkService {

	@Autowired
	private BookmarkMapper bmmapper;
	
	@Override
	public ArrayList<String> getBookmark(String userid) {
		return bmmapper.getBookmark(userid);
	}
	@Override
	public boolean addBookmark(BookmarkDTO bmDto) {
		return bmmapper.addBookmark(bmDto);
	}

	@Override
	public boolean removeBookmark(String userid, String contentid) {
		return bmmapper.removeBookmark(userid,contentid);
	}
}
