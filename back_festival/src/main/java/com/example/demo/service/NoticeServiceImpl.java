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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


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
        System.out.println("공지게시글토탈"+total);
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
    public HashMap<String, Object> getDetail(long noticenum, String loginUser, HttpServletRequest req , HttpServletResponse resp ) {
        HashMap<String, Object> result = new HashMap<>();

        // 게시글 조회
        NoticeDTO notice = nmapper.getNoticeByNoticenum(noticenum);
        List<NoticeFileDTO> files = nfmapper.getFiles(noticenum);
        
        boolean checkViewed = false;
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            // 쿠키에서 해당 게시글을 본 기록이 있는지 확인
            for (Cookie cookie : cookies) {
                System.out.println("Found cookie: " + cookie.getName() + " = " + cookie.getValue());  // 쿠키 이름과 값을 출력
                if ("viewedNotice".equals(cookie.getName()) && cookie.getValue().contains(String.valueOf(noticenum))) {
                    checkViewed = true; // 이미 본 게시글인 경우
                    break;
                }
            }
        }

        // 처음 보는 게시글인 경우에만 readcount 증가
        if (!checkViewed && notice != null) {
            // 로그인한 사용자가 게시글 작성자가 아닌 경우에만 조회수 증가
            if (loginUser != null && !loginUser.equals(notice.getUserid())) {
                // 조회수 증가
                System.out.println("Incrementing readcount for noticenum: " + noticenum);  // readcount 증가 로그
                nmapper.updateReadCount(noticenum, notice.getReadcount() + 1);
                notice.setReadcount(notice.getReadcount() + 1);
                
                // 쿠키에 본 게시글을 기록
                String currentViewedNotices = getViewedNotices(req); // 현재 본 게시글 목록 가져오기
                System.out.println("Current viewed notices: " + currentViewedNotices);  // 현재 본 게시글 목록 로그
                setViewedNoticeCookie(resp, currentViewedNotices, noticenum); // 새로운 쿠키 추가
            } else {
                System.out.println("User has already viewed the notice or is the author."); // 이미 본 게시글이거나 작성자일 경우
            }
        } else {
            System.out.println("Notice has already been viewed. No increment in readcount.");
        }

        result.put("notice", notice);
        result.put("files", files);
        return result;
    }

    // 쿠키에서 본 게시글 목록을 가져오는 메서드
    private String getViewedNotices(HttpServletRequest req) {
        String viewedNotices = "";
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("viewedNotice".equals(cookie.getName())) {
                    viewedNotices = cookie.getValue(); // 기존 쿠키값을 가져옴
                    System.out.println("Existing viewed notices from cookie: " + viewedNotices); // 쿠키에 저장된 본 게시글 목록 출력
                    break;
                }
            }
        }
        return viewedNotices;
    }

    // 본 게시글 번호를 쿠키에 저장하는 메서드
    private void setViewedNoticeCookie(HttpServletResponse resp, String currentViewedNotices, long noticenum) {
        // 기존 본 게시글 목록에 새로운 게시글을 추가
        String newViewedNotices = currentViewedNotices.isEmpty() ? String.valueOf(noticenum) : currentViewedNotices + "," + noticenum;

        // 쿠키 생성
        Cookie viewedCookie = new Cookie("viewedNotice", newViewedNotices);
        viewedCookie.setMaxAge(3 * 60 * 60); // 3시간 동안 유효
        viewedCookie.setPath("/"); // 전체 도메인에 적용
        System.out.println("Setting new cookie with value: " + newViewedNotices);  // 쿠키 값 출력
        resp.addCookie(viewedCookie); // 응답에 쿠키 추가
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