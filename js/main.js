"use strict";

$(function(){
	var listEndpoint = 'https://www.mangaeden.com/api/list/0';
	var infoEndpoint = 'https://www.mangaeden.com/api/manga/';
	var imgEndpont = 'https://cdn.mangaeden.com/mangasimg/';
	var mangalist = {};


	getMangaList().then(function(data, status){
		mapMangaFromRawList(data);
		renderNames();
	});

	$("body .manga-names ul").delegate("li", "click", function(e){
		var clickedElement = $(this);
		var mangaId = clickedElement.data('mangaid');

		addInfoToMangalist(mangaId, clickedElement);
	});


	function renderChapterNames(mangaId){
		var chaptersContainer = $(".chapters ul");
		var chapters = getExtendedMangaInfoById(mangaId).chapters;

		chaptersContainer.empty();

		for (var i = 0; i < chapters.length; i++){
			var currentChapter = chapters[i];
			var listElement = $('<li>' + 'Chapter Number: ' + ' - ' + currentChapter[2] + '<li>');

			listElement.data('chapterid', currentChapter[3]);
			chaptersContainer.append(listElement);
		}
	}


	function addImageToName(clickedElement, clickedMangaPreviewImgUrl){
		var previewImage = $('<img style="height:10%" class="thumbnail" src="' + clickedMangaPreviewImgUrl + '"' + '>');

		clickedElement.append(previewImage);
	}


	function addInfoToMangalist(mangaId, clickedElement){
		var additionalInfo = getExtendedMangaInfoById(mangaId);
		
		if(additionalInfo){
			renderChapterNames(mangaId);
			console.log('info available');
		}else{
			fetchMangaInfo(mangaId).then(function(data, status){
				mangalist[mangaId]['extendedInfo'] = data;

				var previewImgpath = imgEndpont + getExtendedMangaInfoById(mangaId).image;

				addImageToName(clickedElement, previewImgpath);

				renderChapterNames(mangaId);
				console.log('info fetched from API');

			
			});
		}
	}

	function fetchMangaInfo(mangaId){
		return $.get(infoEndpoint + mangaId);
	}

	function renderNames(){
		var $namesContainer = $('.manga-names ul');

		for(var mangaId in mangalist){
			var currentManga = mangalist[mangaId];
			var $listElement = $('<li>' + currentManga.title + '</li>');

			$listElement.data('mangaid', currentManga.Id);
			$namesContainer.append($listElement);
		}
	}



	function getExtendedMangaInfoById(mangaId){
		return mangalist[mangaId]['extendedInfo'];
	}

	function mapMangaFromRawList(data){
		for (var i = 0; i < data.manga.length; i++){
			var currentManga = data.manga[i];

			mangalist[currentManga.i] ={
				"title": currentManga.t,
				"Id": currentManga.i,
				"alias": currentManga.a,
				"status": currentManga.s,
				"category": currentManga.c,
				"lastChapterDate": currentManga.ld,
				"hits": currentManga.h,
				"image": currentManga.im			
			}
		}
	}


	function getMangaList(){
		return $.get(listEndpoint);
	}
});