package com.example.demo.service;

import java.util.ArrayList;

public interface BookmarkService {
	ArrayList<String> getBookmark(String userid);
	boolean addBookmark(String userid, String contentid);
	boolean removeBookmark(String userid, String contentid);
}
