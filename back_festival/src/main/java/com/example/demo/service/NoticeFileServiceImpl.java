package com.example.demo.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.NoticeFileMapper;

@Service
public class NoticeFileServiceImpl implements NoticeFileService{

	@Value("${file.dir}")
	private String savdFolder;
	
	@Autowired
	private NoticeFileMapper nfmapper;

	@Override
	public HashMap<String, Object> getTumbnailResource(String systemname) throws Exception {
		Path path = Paths.get(savdFolder+systemname);
		String contentType = Files.probeContentType(path);
		Resource resource = new InputStreamResource(Files.newInputStream(path));
		
		HashMap<String, Object> datas = new HashMap<>();
		datas.put("contentType", contentType);
		datas.put("resource", resource);
		return datas;
	}

	@Override
	public HashMap<String, Object> downloadFile(String systemname) throws Exception {
		Path path = Paths.get(savdFolder+systemname);
		Resource resource = new InputStreamResource(Files.newInputStream(path));
		String orgname = nfmapper.getFileBySystemname(systemname).getOrgname();
		
		HashMap<String, Object> result = new HashMap<>();
		result.put("resource", resource);
		result.put("orgname", orgname);
		return result;
	}
	
}
