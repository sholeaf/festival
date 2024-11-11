package com.example.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.demo.service.JwtServiceImp;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor{
	
	@Autowired
	private JwtServiceImp service;
	
	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler)
					throws Exception{
		if(req.getMethod().equals("OPTIONS")) {
			// preflight로 넘어온 options는 통과
			return true;
		} 
		else {
			// client에서 요청할 때 header에 넣어둔 "jwt-auth-token"이라는 키 값을 확인
			String token = req.getHeader("jwt-auth-token");
			if(token != null && token.length() > 0) {
				// 토큰 유효성 검증
				service.checkValid(token);
				return true;
			} 
			else { 
				// 유효한 인증토큰이 아닐 경우
				throw new Exception("유효한 인증토큰이 존재하지 않습니다.");
			}
		}
	}
}
