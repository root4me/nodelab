---
{
	"rows": [{
		"columns": [{
			"img": "http://img.youtube.com/vi/84YuwX6Sr5I/0.jpg",
			"desc": "Search for fall color #2 (youtube video)",
			"href": "http://youtu.be/84YuwX6Sr5I",
			"ext": true
		},
		{
			"img": "img/1000x400.gif",
			"desc": "descripton from markdown file",
			"href": "1",
			"ext": false
		}]
	},
	{
		"columns": [{
			"img": "img/1000x400.gif",
			"desc": "",
			"href": "1",
			"ext": false
		},
		{
			"img": "img/1000x400.gif",
			"desc": "descripton and href from markdown file",
			"href": "descripton-from-markdown-file.html",
			"ext": false
		}]
	},
	{
		"columns": [{
			"img": "http://img.youtube.com/vi/84YuwX6Sr5I/0.jpg",
			"desc": "Search for fall color #2 (youtube video)",
			"href": "http://youtu.be/84YuwX6Sr5I",
			"ext": true
		},
		{
			"img": "img/1000x400.gif",
			"desc": "descripton from markdown file",
			"href": "1",
			"ext": false
		}]
	}]
}
---

Generate a list of index pages  (index1.html - indexn.html) based on the JSON shown in header section. 
/templates/indexpages.html defines the layout of the pages. Intent of generating these pages is to load these into a home / landing page as featured content that users can navigate to right from the landing page.


ext : true denotes that the link is to external content and it need to be opened in a new tab.
href : if the link is an internal link, the numeric file name of the markdown draft file is enough for the scritp to generate the html filename as the link.
    If description is left empty in that case, the title of the content will be used as the description.