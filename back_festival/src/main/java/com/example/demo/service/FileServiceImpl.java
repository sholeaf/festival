package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileServiceImpl implements FileService {
	@Value("${file.dir}")
	private String saveFolder;
	
	@Override
	public HashMap<String, Object> getTumbnailResource(String systemname) {
		try {
			Path path = Paths.get(saveFolder+systemname);
			String contentType = Files.probeContentType(path);
			Resource resource = new InputStreamResource(Files.newInputStream(path));
			HashMap<String, Object> datas = new HashMap<>();
			datas.put("contentType", contentType);
			datas.put("resource", resource);
			return datas;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public String saveImage(MultipartFile file) {
		if(file == null) {
			return "null";
		}
		
		int lastIdx = file.getOriginalFilename().lastIndexOf(".");
		String ext = file.getOriginalFilename().substring(lastIdx);

		LocalDateTime now = LocalDateTime.now();
		String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
		String systemname = time + UUID.randomUUID().toString() + ext;
		String path = saveFolder + systemname;
		try {
			file.transferTo(new File(path));
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return systemname;
	}

}
