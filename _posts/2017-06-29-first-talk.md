---
layout: post
title:  "🔈 Swift Talk: Limiting the use of Protocols"
date:   2017-06-29 13:03:23 +0900
description: My first Swift talk
categories: swift talk
---

**TL;DR** (🧀 ❝ ❗)
> Practice like it's real. So when it's real, it's just like practice

# Product first
<div class="web-container">
  <iframe src="https://www.slideshare.net/MikeJSChoi/slideshelf" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>
</div>

# The Talk
Let's start off by saying the topic of the talk off the bat.
> Using protocols everywhere in Swift is not a good thing.

## Protocols?
But before talking about what I just said, let's look at what a protocol is.
There are tons of tutorials online about protocols so I will keep it simple.

Object Oriented                       |  ✅ Protocol Oriented
:-----------------------------------:|:--------------------------------------:
![](http://machinethink.net/images/mixins-and-traits-in-swift-2/ShootingHelper.png) | ![](http://machinethink.net/images/mixins-and-traits-in-swift-2/GameTraits.png)

Basically, you can go from the left to the right. 

Flatter architecture made possible with the concept of **composition is easier to deal with than a complex class hiearchy**.

## What's so bad then?
Let's look at some examples.

```swift
protocol URLStringConvertible {
    var urlString: String { get }
}

// ...

func sendRequest(urlString: URLStringConvertible, method: () -> ()) {
    let string = urlString.urlString
}
```

This `URLStringConvertible` is not accomplishing anything and can simply be replaced by a value. 

But somehow, I think a lot people feel as if using protocols for everything is the right thing to do in Swift; I am one of those people as well. Maybe this is because of the large number of *"Protocol Oriented X"* tutorials on the web or maybe because Apple has been trying to sell Swift as a "Protocol Oriented Language". But whatever the reason,

> Using a protocol without thinking about the consequences is **NOT** a good practice.

# More Examples
Suppose we are making a simple library that is good at creating UIView elements with data inserted in them. So we go ahead and use protocols.

## Protocol Oriented Approach 

```swift
protocol HeaderViewProtocol {
    associatedtype Content
    func setHeader(data: Content)
}
```
At this point, I used to think that I am doing the right thing because **I just created a protocol and that's what you are supposed to do in Swift.**

Let's continue to apply this protocol to various UIView subclassess.

```swift
class MyLabel: UILabel, HeaderViewProtocol {
    func setHeader(data: String) {
        self.text = data
    }
}

class MyButton: UIButton, HeaderViewProtocol {
    func setHeader(data: String) {
        self.titleLabel?.text = data
    }
}
```

Simple enough. Now, I want to make an array of `HeaderViewProtocol` elements so that I can later insert them into a `UICollectionView`.

```swift
// Uh.. what's up with the UIStackView?
// I wanted an array of HeaderViewProtocols...
let elements = [MyLabel(), MyButton(), UIStackView()]
```

To compose classes and protocols to make a type, we could have done `UIView<HeaderViewProtocol>` in Objective-C. But in Swift 3, you can't.

**Note: you can in Swift 4 with class and subtype existentials by doing**

```swift
let elements: HeaderViewProtocol & UIView
```

So in Swift 3, we need to go ahead and create a type eraser like this.

```swift
struct AnyHeaderView<Content>: HeaderViewProtocol {
    var _setHeader: (Content) -> ()
    
    init<T: HeaderViewProtocol>(_ view: T) where Content == T.Content {
        _setHeader = view.setHeader
    }
    
    func setHeader(data: Content) {
        return _setHeader(data)
    }
}
```

Ok, that's a lot of code to keep the compiler happy. Anyway, we can now go ahead make the array with type safety we want.
```swift
let elements = [AnyHeaderView(MyLabel()), AnyHeaderView(MyButton())]
```
## Value Oriented Approach
> But instead of **passing in a type that promises things, couldn't we just pass the things we promised?**

Read that again and think about that for a second.

Let's make a type that can wrap all the things we promised.

```swift
struct HeaderView<T>{
    let view: UIView
    let setHeader: (T) -> ()
}
```

Now, we can do this...

```swift
let label = UILabel()
let labelHeader = HeaderView<String>(view: label) { str in
    label.text = str
}

let imageView = UIImageView()
let imageHeader = HeaderView<UIImage>(view: imageView ) { img in
    imageView.image = img
}

// Displays error! The type safety we wanted!!
let elements = [labelHeader, imageHeader]
```
Using a struct instead of a protocol halved the code size. Once implemented, the solution seems almost too simple to be true that we wonder, "Why couldn't we think of this the first time?"

> Pick the right tool for the job, not the other way around.

# Conclusion
If using protocols in your code is making you write unncessary code to keep the compiler quiet and satisfied, maybe you should consider using a struct / function values instead.

Here's a general rule of thumb.

| Situation                                        | Solution |
|--------------------------------------------------|----------|
| 1 function in protocol?                          | Function |
| 1 > functions?                                   | Protocol |
| Used only once? (completion handlers, callbacks) | Function |
| Used a lot? (data source, delegate)              | Protocol |

# About the talk
<blockquote class="embedly-card"><h4><a href="https://iosdevkor.github.io/let_us_go_2017_summer/">let us: Go!</a></h4><p>iOS Developers Korea 세미나 let us: Go!</p></blockquote>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

This was my first ever programming talk. My content was very techinal and the talk had some live coding in the middle. So naturally, I was nervous.

The talk was held in Korea, at one of [Kakao's buildings](http://www.kakao.com/main). I had just served 2 years in the Army and also had just come back from the [ISC](http://isc-hpc.com) that was held in Germany for a week.

My flight landed the day before the conference so I was sleep deprived and so tired that I couldn't really say all the things I had in my head. I was not prepared for this and maybe I was almost arrogant to think that I would be able to pull this off.

Oh well, at least I learned something from this. At least I won't make the same mistake for my next talk! 🤦‍♂️
