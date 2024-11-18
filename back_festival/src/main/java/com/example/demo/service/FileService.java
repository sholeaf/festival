package com.example.demo.service;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
	HashMap<String, Object> getTumbnailResource(String systemname);
	String saveImage(MultipartFile file);
}
