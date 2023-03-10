package com.hmn.msdsserver.msds.sample;

import java.io.File;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmn.msdsserver.msds.comm.PdfUtil;

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
	
	@GetMapping("/pdftojpg")
	public String pdftojpg(String paramStr) {		

		File srcfile = new File("C:/msds-master/file/root/pdf/4_2_CR-13.pdf");
		File trgfile = new File("C:/msds-master/file/root/pdf/4_2_CR-13.jpg");
		
		try {
			PdfUtil.pdfToThumbnail(srcfile, trgfile, 1400, 900);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return paramStr;
	}
	
	@GetMapping("/pdfstojpgs")
	public String pdfstojpgs(String paramStr) {		

		File srcfiles = new File("C:\\msds-master\\msds-server\\src\\main\\frontend\\src\\assets\\pdf\\root\\pdf");
//		File trgfile = new File("C:/msds-master/file/root/pdf/4_2_CR-13.jpg");

		
		try {
			for(File srcfile : srcfiles.listFiles()) {
				String path = srcfile.getPath();
				File trgfile = new File(path.substring(0,path.length()-3) + "jpg");
				PdfUtil.pdfToThumbnail(srcfile, trgfile, 1400, 900);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return paramStr;
	}

}
