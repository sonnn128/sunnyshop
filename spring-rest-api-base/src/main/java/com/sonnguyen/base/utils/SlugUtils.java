package com.sonnguyen.base.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {
	public static String generateSlug(String input) {
		if (input == null || input.isEmpty())
			return "";

		String temp = Normalizer.normalize(input.toLowerCase(), Normalizer.Form.NFD);
		Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
		String slug = pattern.matcher(temp).replaceAll("").toLowerCase().replaceAll("đ", "d")
				.replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
		return slug;
	}
}
