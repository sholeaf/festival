package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.Criteria;
import com.example.demo.domain.NoticeDTO;
import com.example.demo.domain.NoticeFileDTO;
import com.example.demo.domain.PageDTO;
import com.example.demo.mapper.NoticeFileMapper;
import com.example.demo.mapper.NoticeMapper;
import com.example.demo.mapper.NoticeReplyMapper;


@Service
public class NoticeServiceImpl implements NoticeService{
	@Value("${file.dir}")
	private String saveFolder;
	
	@Autowired
	private NoticeMapper nmapper;
	@Autowired
	private NoticeFileMapper nfmapper;
	@Autowired
	private NoticeReplyMapper nrmapper;

	@Override
	public HashMap<String, Object> getList(Criteria cri) {
		HashMap<String, Object> result = new HashMap<>();
		List<NoticeDTO> list = nmapper.getList(cri);
		
		long total = nmapper.getTotal(cri);
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		
		for(NoticeDTO notice : list) {
			LocalDateTime noticeregdate = LocalDateTime.parse(notice.getNoticeregdate(),dtf);
			Duration duration = Duration.between(noticeregdate, now);
			long elapsedHours = duration.toHours();
			if(elapsedHours < 2) {
				notice.setNew(true);
			}
			long nreplyCnt = nrmapper.getTotal(notice.getNoticenum());
			notice.setNreplyCnt(nreplyCnt);
			int recentNreplyCnt = nrmapper.getRecentNreplyCnt(notice.getNoticenum());
		}
		result.put("notice", list);
		result.put("pageMaker", new PageDTO(total, cri));
		
		return result;
	}

	@Override
	public long regist(NoticeDTO notice, MultipartFile[] files) throws Exception {
		if(nmapper.insertNotice(notice) != 1) {
			return -1;
		}
		long noticenum = nmapper.getLastNum(notice.getUserid());
		if(files == null || files.length == 0) {
			return noticenum;
		}
		else {
			for(int i=0; i<files.length;i++) {
				MultipartFile file = files[i];
				
				String orgname = file.getOriginalFilename();
				int lastIdx = orgname.lastIndexOf(".");
				String ext = orgname.substring(lastIdx);
				
				LocalDateTime now = LocalDateTime.now();
				String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
				String systemname = time+UUID.randomUUID().toString()+ext;
				String path = saveFolder+systemname;
				
				NoticeFileDTO nfdto = new NoticeFileDTO();
				nfdto.setOrgname(orgname);
				nfdto.setSystemname(systemname);
				nfdto.setNoticenum(noticenum);
				nfmapper.insertFile(nfdto);
				
				file.transferTo(new File(path));
			}
			return noticenum;
		}
		
	}

	@Override
	public HashMap<String, Object> getDetail(long noticenum, String loginUser) {
		HashMap<String, Object> result = new HashMap<>();
		
		NoticeDTO notice = nmapper.getNoticeByNoticenum(noticenum);
		List<NoticeFileDTO> files = nfmapper.getFiles(noticenum);
		 
		if(notice != null && notice.getUserid().equals(loginUser)) {
			nmapper.updateReadCount(notice, notice.getReadcount()+1);
			notice.setReadcount(notice.getReadcount()+1);
		}
		result.put("notice", notice);
		result.put("files", files);
		return null;
	}

	@Override
	public long nmodify(long noticenum, HttpStatus ok) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int remove(long noticenum) {
		// TODO Auto-generated method stub
		return 0;
	}

}
