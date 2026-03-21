package com.chd.base.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageRequestDtoIn {
	private int page = 1;
	private int size = 10;
	private String sortBy = "createdAt";
	private String order = "desc";
	private String search = "";

	public int getPage() {
		return Math.max(1, page);
	}

	public int getSize() {
		return Math.min(Math.max(1, size), 100);
	}
}
