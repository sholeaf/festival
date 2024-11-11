package com.example.demo.service;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.demo.domain.UserDTO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtServiceImp {
	private String secretKey = "myKey"; // 서명에 사용할 secretKey
	private long exp = 1000L * 60 * 60; // 토큰 사용가능 시간, 1시간
	
	// 토큰 생성하는 메서드
	public String createToken(UserDTO user) {
		// 토큰에 담고싶은 값 파라미터로 가져오기
		return Jwts.builder()
					// 토큰 타입
				   .setHeaderParam("typ", "JWT")
				   // 토큰 제목
				   .setSubject("userToken")
				   // 토큰 유효시간
				   .setExpiration(new Date(System.currentTimeMillis() + exp))
				   // 토큰에 담을 데이터
				   .claim("user", user)
				   // secretKey를 사용하여 해싱 암호화 알고리즘 처리
				   .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
				   // 직렬화, 문자열로 변경
				   .compact();
	}
	
	// 토큰에 담긴 정보를 가져오기 메서드
	public Map<String, Object> getInfo(String token) throws Exception {
		Jws<Claims> claims = null;
		try {
			// secretKey를 사용하여 복호화
			claims = Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token);
		} catch(Exception e) {
			throw new Exception();
		}
		
		return claims.getBody();
	}
	
	// interceptor에서 토큰 유효성을 검증하기 위한 메서드
	public void checkValid(String token) {
		Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token);
	}
}
