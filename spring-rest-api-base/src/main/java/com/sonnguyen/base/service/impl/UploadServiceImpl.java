
package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.service.UploadService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadServiceImpl implements UploadService {

	@Override
	public String uploadImage(MultipartFile file) {
		// TODO: Implement Cloudinary upload logic
		return null;
	}
}
