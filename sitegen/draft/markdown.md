---
title: All you can eat markdown
author: author name
date: 04/01/2014
---


 A First Level Header
 ====================
    
A Second Level Header
---------------------

### Header 3

> This is a blockquote.
> 
> This is the second paragraph in the blockquote.
>
> ## This is an H2 in a blockquote

### Phrase Emphasis ###

Markdown uses asterisks and underscores to indicate spans of emphasis.
Some of these words *are emphasized*.
Some of these words _are emphasized also_.
    
Use two asterisks for **strong emphasis**.
Or, if you prefer, __use two underscores instead__.

## Lists ##

Unordered (bulleted) lists use asterisks, pluses, and hyphens (`*`,
`+`, and `-`) as list markers. These three markers are
interchangable; this:

*   Candy.
*   Gum.
*   Booze.

this:

+   Candy.
+   Gum.
+   Booze.

and this:

-   Candy.
-   Gum.
-   Booze.


Ordered (numbered) lists use regular numbers, followed by periods, as
list markers:

1.  Red
2.  Green
3.  Blue

### Links ###

This is an [example link](http://example.com/)
This is an [example link](http://example.com/ "With a Title")Reference-style links allow you to refer to your links by names, which
you define elsewhere in your document:

I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3]

[1]: http://google.com/        "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[3]: http://search.msn.com/    "MSN Search"

### Images ###

Image syntax is very much like link syntax.

Inline (titles are optional):

![alt text](images/img.jpg "Title")

Reference-style:

![alt text][id]

[id]: /images/img.jpg "Title"

### Code ###

In a regular paragraph, you can create code span by wrapping text in
backtick quotes. Any ampersands (`&`) and angle brackets (`<` or
`>`) will automatically be translated into HTML entities. This makes
it easy to use Markdown to write about HTML example code:

    I strongly recommend against using any `<blink>` tags.

    I wish SmartyPants used named entities like `&mdash;`
    instead of decimal-encoded entites like `&#8212;`.

