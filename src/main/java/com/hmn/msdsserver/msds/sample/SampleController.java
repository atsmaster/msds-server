package com.hmn.msdsserver.msds.sample;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sample")
@RequiredArgsConstructor
public class SampleController {
	
	
	@GetMapping("/teststr")
	public String teststr(String paramStr) {		
		paramStr += " okok";		
		return paramStr;
	}

}
