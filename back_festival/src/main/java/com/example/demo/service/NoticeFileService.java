package com.example.demo.service;

import java.util.HashMap;

public interface NoticeFileService {

	HashMap<String, Object> getTumbnailResource(String systemname) throws Exception;
	HashMap<String, Object> downloadFile(String systemname) throws Exception;

}
