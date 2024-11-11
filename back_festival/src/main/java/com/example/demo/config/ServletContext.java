package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.demo.interceptor.JwtInterceptor;

@Configuration
@EnableWebMvc
//Interceptor도 스캔
@ComponentScan(basePackages = {"com.example.demo.controller", "com.example.demo.interceptor"})
public class ServletContext implements WebMvcConfigurer{
	
	@Autowired
	JwtInterceptor jwtInterceptor;
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("*")
						.allowedHeaders("*")
						.exposedHeaders("jwt-auth-token");
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(jwtInterceptor)
							.addPathPatterns("/**")
							.excludePathPatterns(new String[]{"/excludePath/**"});
	}
}
