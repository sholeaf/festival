package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.BoardDTO;
import com.example.demo.domain.UserDTO;
import com.example.demo.domain.UserInfoDTO;
import com.example.demo.mapper.BoardMapper;
import com.example.demo.mapper.BookmarkMapper;
import com.example.demo.mapper.ReplyMapper;
import com.example.demo.mapper.UserFileMapper;
import com.example.demo.mapper.UserInfoMapper;
import com.example.demo.mapper.UserMapper;

@Service
public class UserServiceImp implements UserService{
	
	@Value("${file.dir}")
	private String saveFolder;
	
	@Autowired
	private UserMapper umapper;
	
	@Autowired
	private UserInfoMapper uimapper;
	
	@Autowired
	private UserFileMapper fmapper;
	
	@Autowired
	private BoardMapper bmapper;

	@Autowired
	private BookmarkMapper bmmapper;
	
	@Autowired
	private ReplyMapper rmapper;
	
	@Override
	public boolean join(UserDTO user, UserInfoDTO userInfo) {
		if(fmapper.firstInsert(user.getUserid())) {
			int userSuccess = umapper.insertUser(user);
			int infoSuccess = uimapper.insertUserInfo(userInfo);
			if(userSuccess == 1 && userSuccess == infoSuccess) {
				return true;							
			}
		}
		return false;
	}

	@Override
	public boolean login(String userid, String userpw) {
		UserDTO user = umapper.getUserByUserid(userid);
		if(user != null) {
			if(user.getUserpw().equals(userpw)) {
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean checkId(String userid) {
		UserDTO user = umapper.getUserByUserid(userid);
		return user == null;
	}

	@Override
	public boolean leaveId(String userid) {
		return umapper.deleteUser(userid) == 1;
	}


	@Override
	public HashMap<String, Object> getUser(String userid) {
		HashMap<String, Object> result = new HashMap<>();
		
		UserDTO user = umapper.getUserByUserid(userid);
		UserInfoDTO userInfo = uimapper.getUserInfoByUserid(userid);
		String file = fmapper.getFile(userid);
		
		result.put("user", user);
		result.put("userInfo", userInfo);
		result.put("file", file);
		
		return result;
	}

	@Override
	public UserDTO getUserid(String email) {
		return umapper.getUserByUseremail(email);
	}

	@Override
	public boolean modifyUser(UserDTO user) {
		return umapper.updateUser(user) == 1;
	}

	@Override
	public boolean modifyPw(String userid, String userpw) {
		return umapper.updatePw(userid, userpw);
	}

	@Override
	public int profileModify(String userid, MultipartFile file, String deleteFile) {
		System.out.println(file);
		
		if(file != null) {
			boolean flag = false;
			//후에 비즈니스 로직 실패 시 원래대로 복구하기 위해 업로드 성공했던 파일들도 삭제해 주어야 한다.
			//업로드 성공한 파일들의 이름을 해당 리스트에 추가하면서 로직을 진행한다.
			String orgname = file.getOriginalFilename();
			//수정의 경우 중간에 있는 파일이 수정되지 않은 경우도 있다.(원본 파일 그대로 둔 경우)
			//그런 경우 file의 orgname은 null 이거나 "" 이다.
			//따라서 파일 처리를 할 필요가 없으므로 반복문을 넘어간다.

			//파일 업로드 과정(regist와 동일)
			int lastIdx = orgname.lastIndexOf(".");
			String ext = orgname.substring(lastIdx);
			LocalDateTime now = LocalDateTime.now();
			String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
			String systemname = time+UUID.randomUUID().toString()+ext;
			String path = saveFolder+"user/"+systemname;
			
			flag = fmapper.updateFile(userid, systemname) == 1;
			try {
				file.transferTo(new File(path));
			} catch (IllegalStateException e) {
				e.printStackTrace();
				System.out.println("파일첨부 실패1");
			} catch (IOException e) {
				e.printStackTrace();
				System.out.println("파일첨부 실패2");
			}
			
			//강제탈출(DB insert 실패)
			if(!flag) {
				//업로드 했던 파일 삭제, 게시글 데이터 돌려놓기, 파일 data(실제 파일) 삭제, ...
				//아까 추가했던 systemname들(업로드 성공했던 파일의 이름)을 꺼내오면서
				File file1 = new File(saveFolder+"user/",systemname);
				if(file1.exists()) {
					file1.delete();
				}
				//DB상에서도 삭제
				fmapper.deleteFileBySystemname(systemname);
			}
			else {
				// [apple.png, banana.png]
				if(deleteFile.equals("test.png")) {
					return 1;
				}
				else {
					File file1 = new File(saveFolder+"user/",deleteFile);
					if(file1.exists()) {
						file1.delete();
						
						fmapper.deleteFileBySystemname(deleteFile);
					}
					return 1;					
				}
			}
		}
		return -1;
	}

	@Override
	public int defaultProfile(String userid, String deleteFile) {
		if(fmapper.defaultFile(userid) == 1) {
			if(deleteFile.equals("test.png")) {
				return 1;
			}
			else {
				File file = new File(saveFolder+"user/",deleteFile);
				if(file.exists()) {
					file.delete();
				}				
			}
			return 1;
		}
		return -1;
	}
	
	@Override
	public int deleteUser(String userid) {
		// deleteUser를 통해 삭제 해야하는 것들
		// 1. user			(O)
		//		->	userid로 삭제 가능
		// 2. user_info		(O)
		//		->	userid로 삭제 가능
		// 3. user_photo	(O)
		//		->	userid로 삭제 가능
		// 4. user가 작성한 board	(O)
		//		->	userid로 삭제 가능
		// 5. user가 작성한 board에 작성되어 있는 reply (O)
		//		->	userid로 boardnum을 가져와서 삭제 
		// 6. user가 작성한 board의 board_like (O)
		//		->	userid로 boardnum을 가져와서 삭제 
		// 7. user가 작성한 board의 board_report (O)
		//		->	userid로 boardnum을 가져와서 삭제 
		// 8. user가 신고한 board의 board_report
		//		->	userid로 삭제 가능
		// 9. user가 작성한 reply
		//		->	userid로 삭제 가능
		// 10. user가 신고한 reply의 reply_report
		//		-> userid로 삭제 가능
		// 11. user가 받은 note
		//		-> userid로 삭제 가능
		// 12. user가 누른 board_like
		//		-> userid로 삭제 가능
		// 13. user가 작성한 board에 작성되어 있는 reply의 reply_report
		//		-> userid로 boardnum을 가져와서 작성된 
		//			reply의 replynum을 가져와서 reply_report 삭제
		//
		// 
		// 
		int userinfo = uimapper.deleteUserInfo(userid);
		int file = fmapper.deleteFileByUserid(userid);
		long[] boardnum = bmapper.getBoardnumByUserid(userid);
		if(boardnum != null && boardnum.length != 0) {
			for(int i = 0; i < boardnum.length; i++) {
				long[] replynum = rmapper.getReplynumByBoardnum(boardnum[i]);
				rmapper.deleteAllReplyByBoardnum(boardnum[i]);
				bmapper.deleteReportByBoardnum(boardnum[i]);
				bmapper.deleteLikeByBoardnum(boardnum[i]);
				
			}
		}
		int board = bmapper.deleteBoardByUserid(userid);
				return umapper.deleteUser(userid);
	}

	@Override
	public HashMap<String, Object> getList(String userid) {
		HashMap<String, Object> result = new HashMap<>();
		
		List<BoardDTO> list = bmapper.getListByUserid(userid);
		List<String> bookmarks = bmmapper.getBookmark(userid);
		
		result.put("list", list);
		result.put("bookmarks", bookmarks);
		return result;
	}
	
	@Override
	public int updateInfo(UserInfoDTO userInfo) {
		return uimapper.updateUserInfo(userInfo);
	}
}
