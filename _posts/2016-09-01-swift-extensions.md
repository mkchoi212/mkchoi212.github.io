---
layout: post
title:  "Different ways to use Swift Extensions"
date:   2016-09-01 20:21:23 +0900
description: "Content may be controversial"
tags: 
- swift 
- extensions
---

Having used them for awhile, I’m not sure how I feel about them. In the beginning, I loved them and the new workflow they enabled. But as time went on, extensions became a go to garbage pile for code.

So, I decided to try to organize my views on extensions by coming up with some ways one could use them for and trying to pick out which ones are good and which ones are bad.

## Private Helpers

In Objective-C, we had .h and .m files and despite the fact that we had two files where we could just have one .swift file, there were some advantages to it. The biggest one was that we could just look at the .h file and look at all the externals. But at the same time, internal things were hidden away in the .m file — including private properties/functions. So, how do we do the same thing in Swift?

We can first start off with a giant struct/class with all the internals in it — whether they are public or private.

But, we could refactor by having the main struct declared with all the public values and having a private extension to that struct.

```swift
struct Pokemon {
   let name: String
   …
}
private extension Pokemon {
   func applyDamage(hitPoint: Int){
      ...
   }
}
```

Now, no one can hurt our Pokemon with an evil intent!

## Grouping

I came up with this awhile ago but the idea is that you can use extensions to just group various code blocks for your visual pleasure.

One could say “Hey, just use a pragma mark or // Mark” or “If you need to do this, you should probably start by refactoring your code anyways.”

I would agree to both of those opinions but hey, I’m just throwing stuff out there and maybe this could someday come to use!

The idea is simple. Let’s say you have a view controller and things are starting to look like it’s leaning more towards the region of massive view controllers. So in order to tidy things up, you decide to break your code into chunks before you start with the real refactoring. You know you can use // Mark but you don’t like how they look so lets say you decided to go with extensions.

```swift
extension MyMassivePokemonViewController {
   func addMorePokemons(...)
   ...
}
```

I agree this one is iffy. This is not what extensions were designed for but still, I think they are useful when starting to refactor large code bases.

## Grouping for Protocol Conformance

This one is good. Tired of having code for UITableViewDelegate and UITableViewDataSource in the same place? Well, this is for you.

The idea is simple. We are doing the same code grouping as we have done previously but only with code that conform to certain protocols. So you would have one extension for your TableViewController that contains code that conform to the TableViewDelegate and another for the TableViewDataSource.

```swift
extension MyTableViewControler : UITableViewDelegate {
    ...
}
extension MyTableViewControler : UITableViewDataSource{
    ...
}
```

This separates the code definitely when compared to using pragma marks and is one of the most effective ways of using protocols — I think. Am I starting to sound like Scott Myers?

Oh and thanks to NatashaTheRobot for most of these ideas!
