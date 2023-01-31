package com.hmn.msdsserver.msds.comm;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;

public class PdfUtil {

	public static BufferedImage pdfToThumbnail(File srcFile, File trgFile, int width, int height) throws Exception {
		BufferedImage mergeImg = null;
		try {
			PDDocument document = PDDocument.load(srcFile);

			int pdfPageCnt = document.getNumberOfPages();
			if (pdfPageCnt <= 0) {
				throw new Exception();
			}
			
			
			PDFRenderer pdfRenderer = new PDFRenderer(document);
			if(pdfPageCnt == 1) {
				mergeImg = onePageThumbnail(pdfRenderer, width, height);
			}else {
				mergeImg = twoPageThumbnail(pdfRenderer, width, height);
			}
			
			ImageIO.write(mergeImg, "jpg", trgFile);

		} catch (IOException e) {
			trgFile.delete();
			e.printStackTrace();
		}

		return mergeImg;
	}
	
	private static BufferedImage onePageThumbnail(PDFRenderer pdfRenderer, int width, int height) throws IOException {		
		// 이미지로드 및 리사이징
		BufferedImage pdfFirstPage = pdfRenderer.renderImageWithDPI(0, 100, ImageType.RGB);
		Image rPdfFirstPage = pdfFirstPage.getScaledInstance(width / 2, height, Image.SCALE_SMOOTH);
		
		// 이미지 합치기
		BufferedImage mergedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics = (Graphics2D) mergedImage.getGraphics();

		graphics.setBackground(Color.WHITE);
		graphics.drawImage(rPdfFirstPage, 0, 0, null);
		return mergedImage;
	}
	private static BufferedImage twoPageThumbnail(PDFRenderer pdfRenderer, int width, int height) throws IOException {	
		// 이미지로드 및 리사이징
		BufferedImage pdfFirstPage = pdfRenderer.renderImageWithDPI(0, 100, ImageType.RGB);
		BufferedImage pdfSecondPage = pdfRenderer.renderImageWithDPI(1, 100, ImageType.RGB);
		Image rPdfFirstPage = pdfFirstPage.getScaledInstance(width / 2, height, Image.SCALE_SMOOTH);
		Image rPdfSecondPage = pdfSecondPage.getScaledInstance(width / 2, height, Image.SCALE_SMOOTH);

		//이미지 합치기
		BufferedImage mergedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics = (Graphics2D) mergedImage.getGraphics();

		graphics.setBackground(Color.WHITE);
		graphics.drawImage(rPdfFirstPage, 0, 0, null);
		graphics.drawImage(rPdfSecondPage, width/2, 0, null);
		graphics.setColor(Color.gray);
		graphics.drawLine(width / 2, 0, width / 2, height);
		return mergedImage;
	}
}
