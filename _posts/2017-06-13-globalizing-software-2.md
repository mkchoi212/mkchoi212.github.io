---
layout: post
title:  "Globalizing Software (Cont.)"
date:   2017-06-13 15:49:23 +0900
description: Customize your UI to fit your target country's cultural preferences. 
categories: ui
---

**TL;DR** You want to customize your UI to fit your target country's cultural preferences. To find out what those might be, start my looking at the most famous websites in that country.

## Recap
In the last post, I talked about two main methods an application can apply in order to become a global application. The first method was to simply localized the app. The second method was to provide basic cultural support within the app for things such as string formatting and input method.

## UI Globalization
The most important step towards globalizing an application is the globalization of the UI to fit the target country's culture. In order to explain what I mean by this, here's a picture of Naver, the larget search engine company in Korea, compared to Google, the larget search engine company in America.

Naver (Korea)                        |  Google (US)
:-----------------------------------:|:--------------------------------------:
![]({{ site.url }}/assets/naver.png) | ![]({{ site.url }}/assets/google.png)

You can clearly see that while Naver's home page is full of media content while Google's home page has 3 main interactive elements. 

Here's another example,

11st (Korea)            |  Amazon (US)
:-----------------------------------:|:--------------------------------------:
![]({{ site.url }}/assets/11.png)    | ![]({{ site.url }}/assets/amazon.png)

11st is one of the most popular shopping website in Korea. You can see here again that the amount of information being shown on the home page is significantly different. 

I could go for days on all these comparison examples but I hope you got the point by now.

Now, you may start thinking "Well, maybe the UI/UX team at that company just didn't do a good job" Well, 99% of Koreans would think otherwise.

### Reason #1
In Korea, wealth of information is something people favor over the popular minimalism ideals supported by most American software companies. The reasoning behind this is that by being able to see more contents on the home page, Koreans are able to catch up to the last news, fashion trends, and more. In a fast paced, image conscious culture such as Korea, being up to date on all those things matter on a personal and social level. 

### Reasion #2
Or here's another way of thinking about it if you are still not convinced.
Everyday, countless people go to work using the extensive subway system in Korea. If you get on one, you will see that 90% of people are staring into their phone, 8% are sleeping, and 2% are reading a book/newspaper. The 90% of people needed something to do and as time went on, Naver became the goto website for people, henceforth making Naver part of the culture. As people used Naver more and more, users became more comfortable with the website's UI. In order to stay competitive, other websited began to take hints from Naver. And there you go... a specific UI preference just became part of the country's culture.

**And culture tops personal preference most of the time.** Now this is quite a statement to make and is almost the same as saying "Hipsters don't exist" but still, hipsters still need a good search engine, right?


## So, I'm not a culture expert on all 195 different countries in the world

Well, I understand that. If you were a big corporation like Google, you could just set up a local company in all 195 countries but you aren't so.. here's my suggestion. 

> Refer to the most famous websites in that country for design queues.

But it's weird to even think about Google becoming like that one Korean search engine full of media content.

> The point here is to incrementally adapt cultural UI queues.

So instead of going from 0 to 100 real quick, one should increment by 10 every quarter while observing users' reaction to the change.

## 0 to 10, not 100
One of the most used feature in Naver (Korea) is the **Top 10 real-time searched keyword list.** So, allow me to propose the first incremental change Google could make to adopt to Korean culture. 

*Note that Google Korea's current UI is identical to Google America's UI.*

![The continent would be the Korean peninsula but I'm working with limited graphic resources]({{ site.url }}/assets/google_korea.jpeg)

The above approach would be a good initial approach to UI globalization. The UI below indicating the currently trending searches were taken straight from Google Trends.

## Wrap up
So... instead of just releasing couple of language packs and saying "Ok, we just went global", give some consideration about the UI and the culture of people who are going to be interacting with it by

1. Look at the most visited website in the country
2. Take notes on its UI
3. Divide into 10 (x) unique characteristics/elements
4. Make necessary changes over 10 (x) quarters
