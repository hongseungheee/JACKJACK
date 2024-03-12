package com.tjoeun.jj.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tjoeun.jj.dto.PostDto;
import com.tjoeun.jj.service.FeedService;

@RestController
@RequestMapping("/api/feeds")
public class FeedController {
	
	@Autowired
	FeedService fs;
	
	@PostMapping("/post")
	public HashMap<String, Object> post(@RequestBody PostDto post){
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result.put("message", fs.insertFeed(post) ? "OK" : "Error");
		
		return result;
	}
	
	@PostMapping("/getallfeeds")
	public HashMap<String, Object> getAllFeeds(@RequestParam("page") int page){
		HashMap<String, Object> result = new HashMap<String, Object>();
		PageRequest pageRequest = PageRequest.of(page, 3);
		
		result.put("feeds", fs.getAllFeeds(pageRequest));
		
		return result;
	}
	
	@PostMapping("/getfeedimgbyfeedid")
	public HashMap<String, Object> getFeedimgByFeedid(@RequestParam("feedid") Integer feedid){
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result.put("images", fs.getFeedimgByFeedid(feedid));
		
		return result;
	}
}