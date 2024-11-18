package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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

        for (NoticeDTO notice : list) {
            LocalDateTime noticeregdate = LocalDateTime.parse(notice.getNoticeregdate(), dtf);
            Duration duration = Duration.between(noticeregdate, now);
            long elapsedHours = duration.toHours();
            if (elapsedHours < 2) {
                notice.setNew(true);
            }
        }
        result.put("notice", list);
        result.put("pageMaker", new PageDTO(total, cri));

        return result;
    }

    @Override
    public long regist(NoticeDTO notice, MultipartFile[] files) throws Exception {
        if (nmapper.insertNotice(notice) != 1) {
            return -1;
        }
        long noticenum = nmapper.getLastNum(notice.getUserid());
        if (files == null || files.length == 0) {
            return noticenum;
        } else {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];

                String orgname = file.getOriginalFilename();
                int lastIdx = orgname.lastIndexOf(".");
                String ext = orgname.substring(lastIdx);

                LocalDateTime now = LocalDateTime.now();
                String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
                String systemname = time + UUID.randomUUID().toString() + ext;
                String path = saveFolder + systemname;

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

        if (notice != null && notice.getUserid().equals(loginUser)) {
            nmapper.updateReadCount(noticenum, notice.getReadcount() + 1);
            notice.setReadcount(notice.getReadcount() + 1);
        }
        result.put("notice", notice);
        result.put("files", files);
        return result;
    }

    @Override
    public long nmodify(NoticeDTO notice, MultipartFile[] files, String[] deleteFiles) throws Exception {
        long noticenum = notice.getNoticenum();
        NoticeDTO orgNotice = nmapper.getNoticeByNoticenum(noticenum);

        if (nmapper.updateNotice(notice) != 1) {
            return -1;
        }

        // 기존 파일 목록 가져오기
        List<NoticeFileDTO> orgFileList = nfmapper.getFiles(notice.getNoticenum());
        
        // 파일이 없고, 새로 업로드된 파일도 없으면 그대로 리턴
        if (orgFileList.size() == 0 && (files == null || files.length == 0)) {
            return noticenum;
        } else {
            boolean flag = false;
            ArrayList<String> sysnames = new ArrayList<>();
            // 새로 업로드된 파일 처리
            if (files != null && files.length > 0) {
                for (int i = 0; i < files.length; i++) {
                    MultipartFile file = files[i];
                    String orgname = file.getOriginalFilename();

                    if (orgname == null || orgname.equals("")) {
                        continue;
                    }

                    int lastIdx = orgname.lastIndexOf(".");
                    String ext = (lastIdx > 0) ? orgname.substring(lastIdx) : ""; // 확장자 처리
                    if (ext.isEmpty()) {
                        continue;  // 확장자가 없는 파일은 건너뜀
                    }

                    // 고유한 시스템 파일명 생성
                    LocalDateTime now = LocalDateTime.now();
                    String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
                    String systemname = time + UUID.randomUUID().toString() + ext;
                    String path = saveFolder + systemname;

                    // DB에 파일 정보 저장
                    NoticeFileDTO nfdto = new NoticeFileDTO();
                    nfdto.setOrgname(orgname);
                    nfdto.setSystemname(systemname);
                    nfdto.setNoticenum(noticenum);
                    flag = nfmapper.insertFile(nfdto) == 1;

                    // 파일 저장
                    file.transferTo(new File(path));

                    sysnames.add(systemname);

                    if (!flag) {
                        break;
                    }
                }
                if (!flag) {
                    // 실패 시 업로드한 파일 삭제 및 DB 롤백
                    for (String systemname : sysnames) {
                        File file = new File(saveFolder, systemname);
                        if (file.exists()) {
                            file.delete();
                        }
                        nfmapper.deleteFileBySystemname(systemname);
                    }
                }
            }

            // 삭제된 파일 처리
            if (deleteFiles != null && deleteFiles.length > 0) {
                for (String systemname : deleteFiles) {
                    File file = new File(saveFolder, systemname);
                    if (file.exists()) {
                        file.delete();
                    }
                    nfmapper.deleteFileBySystemname(systemname);
                }
            }

            return noticenum;
        }
    }

    @Override
    public long remove(long noticenum) {
        if (nmapper.deleteNotice(noticenum) == 1) {
            nrmapper.deleteRepliesByNoticenum(noticenum);
            List<NoticeFileDTO> files = nfmapper.getFiles(noticenum);
            for (NoticeFileDTO nfdto : files) {
                File file = new File(saveFolder, nfdto.getSystemname());
                if (file.exists()) {
                    file.delete();
                    nfmapper.deleteFileBySystemname(nfdto.getSystemname());
                }
            }
            return noticenum;
        }
        return -1;
    }
}