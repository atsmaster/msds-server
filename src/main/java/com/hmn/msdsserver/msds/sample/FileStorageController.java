package com.hmn.msdsserver.msds.sample;

import java.io.File;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hmn.msdsserver.msds.comm.PdfUtil;
import com.hmn.msdsserver.msds.domain.message.ResponseMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileStorageController {

	@GetMapping("/jpgtest")
	public void jpgtest() {

		File srcfile = new File("C:/Users/LG/Documents/카카오톡 받은 파일/root/pdf/3_1_ARCALOY 439.pdf");
		File trgfile = new File("C:/Users/LG/Documents/카카오톡 받은 파일/root/pdf/3_1_ARCALOY 439.jpg");
		try {
			PdfUtil.pdfToThumbnail(srcfile, trgfile, 1600, 800);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@PostMapping("/upload")
	public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {
		String message = "";
		try {
//			storageService.store(file);

			message = "Uploaded the file successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage(message));
		}
	}

//	@GetMapping("/download/{id}")
//	public ResponseEntity<byte[]> getFile(@PathVariable String id) {
////		FileDB fileDB = storageService.getFile(id);
//
//		return ResponseEntity.ok()
//				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
//				.body(fileDB.getData());
//	}
}
