title = Why You Should Consider Go?
desc = Comparing Go with PHP, Python, Java and Node.js on the server-side
date = 2020-05-25
dir = ltr
lang = en
---
# Why You Should Consider Go? <!-- omit in toc -->

# Content <!-- omit in toc -->
- [Introduction](#introduction)
- [Where PHP Stands](#where-php-stands)
  - [PHP at Facebook](#php-at-facebook)
    - [Hack and HHVM](#hack-and-hhvm)
    - [Why Hasn't Facebook Migrated Away From PHP?](#why-hasnt-facebook-migrated-away-from-php)
  - [PHP Developers’ Salary](#php-developers-salary)
  - [PHP: A Fractal of Bad Design](#php-a-fractal-of-bad-design)
- [Web Framework Benchmarks – TechEmpower](#web-framework-benchmarks--techempower)
- [BenchmarksGame](#benchmarksgame)
- [Where Node.js Stands](#where-nodejs-stands)
- [Go at Google](#go-at-google)
- [Conclusion](#conclusion)


# Introduction
Decisions on what technology stack to use is always a trade-off that factors mainly 4 things:


1. Skillset of the available developers
2. Cost of development
3. Time required
4. Amount of dependence on technologies (code already written, available libraries, …etc.)


Most often, performance is neglected. Leading to long-term costs. Sure you "get things done" faster and cheaper, but you'll pay for it later, hiring more to fix bugful code and handle bottle necks, just to hit the limits of the framework/language. Hopefully, you realize it.

There are many aspects of programming that must be considered when deciding the best programming language for the job. Some metrics can be measured with numbers, while others are too complex to summarize with few numbers, hence, human intuition and experience are paramount.

We will look at the following **numbers**:
* [Overflow 2019 Developers’ Survey](https://insights.stackoverflow.com/survey/2019)
* Framework Benchmarks [Round 17 of 2018-10-30](https://www.techempower.com/benchmarks/#section=data-r17&hw=ph&test=plaintext) – TechEmpower
* [BenchmarksGame's benchmarks](https://benchmarksgame-team.pages.debian.net/benchmarksgame/) on PHP, Python, Java, Node.js and Go

As well as the following **cases**:
* We will see what Facebook’s engineer Yishan Sparklepants Wong has to say about PHP at Facebook
* What the creator of Node.js has to say about Node.js vs. Go
* What is the stance of the creator of Express.js on Node.js and Go
* Google engineers such as Robert Love, Matt Welsh, and Rob Pike, on replacing C++, and Java with Go

I would really appreciate your feedback. Please feel free to poke holes in my argument; in a constructive manner.

# Where PHP Stands
Over 100,000 developers took the [Stack Overflow 2019 survey](https://insights.stackoverflow.com/survey/2019#most-loved-dreaded-and-wanted) from which the following table is extracted. Most Loved, Dreaded, and Wanted Languages:

![Most Loved, Dreaded, and Wanted Languages (StackOverflow 2019 Survey)](/assets/img/go-report/loved,dreaded,wanted.PNG)

* **Most Loved**: % of developers who are developing with the language or technology and have expressed interest in continuing to develop with it.
* **Most Dreaded**: % of developers who are developing with the language or technology but have not expressed interest in continuing to do so.
* **Most Wanted**: % of developers who are not developing with the language or technology but have expressed interest in developing with it.

PHP lost its popularity to more modern languages like JavaScript (Node.js), Go, and Python’s versatile functionality that allows programing in many fields, including web development, which attracted lots of web developers.

## PHP at Facebook
“But Facebook is using PHP, aren’t they?” Well, when Facebook started in 2004, PHP was the best choice for web development, among few choices. However, nowadays, we have alternatives such as Python’s frameworks, Node.js, and Go. Keep in mind that [Facebook uses C++ heavily on its back-end systems for performance reasons](https://www.zdnet.com/article/facebook-may-release-its-core-c-library-this-year/), and it’s not all just PHP.

### Hack and HHVM
Facebook engineers developed their own VM to run PHP code, as well as to run a different programming language they called [Hack](https://hacklang.org/).  They have been moving away from PHP towards Hack. [HVVM](https://hhvm.com/), Facebooks’ open source VM for executing Hack and PHP code, [is ending support for PHP](https://hhvm.com/blog/2018/09/12/end-of-php-support-future-of-hack.html).

### Why Hasn't Facebook Migrated Away From PHP?
[Yishan Sparklepants Wong](https://www.zdnet.com/article/why-facebook-hasnt-ditched-php/), an engineer who worked at Facebook from December 2005 to March 2010. Replying to the question posted on Quora: “Why hasn't Facebook migrated away from PHP”, he says:
* Inertia is what keeps them from changing (the amount of code already written)
* To get by, they enforce very strict code conventions and reviews to avoid the flaws of the language
* Re-writing an entire codebase in another language is usually one of the worst things you can do, so at all levels there is a reluctance to do that
* The preferred strategy is to write new components in a de-coupled manner using a better language of choice (C++, Python, Erlang, Java, etc.);

## PHP Developers’ Salary
You can find PHP at the bottom-left ..
![Salary and Experience By Language (StackOverflow 2019 Survey)](/assets/img/go-report/Salary-and-experience-by-language.png)


## PHP: A Fractal of Bad Design
> “Do not tell me that Facebook and Wikipedia are built in PHP. I’m aware! They could also be written in Brainfuck, but as long as there are smart enough people wrangling the things, they can overcome problems with the platform. For all we know, development time could be halved or doubled if these products were written in some other language; this data point alone means nothing.” – [eev.ee](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/)

Read more:
* [PHP: A Fractal of Bad Design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/)
* [PHP sadness](http://phpsadness.com/) by Eric Wastl
* [PHP turtles](https://www.quaxio.com/wtf/php.html) by a previous co-author of Hack (Alok Menghrajani)

Still not sure? then, let's look at **benchmarks**. Again, please read with an open mind.

# Web Framework Benchmarks – TechEmpower
This is a performance comparison of many web application frameworks executing fundamental tasks such as JSON serialization, database access, and server-side template composition. Each framework is operating in a realistic production configuration. Results are captured on cloud instances and on physical hardware. The test implementations are largely community-contributed, and all source is available at the GitHub repository.

The following table is constructed from [Round 17 of 2018-10-30](https://www.techempower.com/benchmarks/#section=data-r17&hw=ph&test=plaintext). The first column shows the 6 different test types, and under each column corresponding to a programming language, is the score of the best framework in this test.

**Note**: I tried comparing the most popular frameworks in each language to reflect the experience of most developers and most code bases.

![Round 17 of 2018-10-30 techempower benchmark](/assets/img/go-report/TechEmpower-Round17of2018-10-30.PNG)

Below are the same results scale colored for better comparison:
![Round 17 of 2018-10-30 techempower benchmark](/assets/img/go-report/TechEmpower-Round17of2018-10-30-colored-scaled.PNG)

**Interpretation**: Go is the best in web dev., followed by Java, then Node.js. PHP comes last and doesn’t even compare to Python. *PHP (Laravel, Symfony) is a sure way to burn money*.

# BenchmarksGame
The following benchmarks show measurements of C, Java, Go, PHP, Node.js, and Python. The tables below are sorted by time, ascendingly. Our baseline, rank 0, is C. Benchmark [source link here](https://benchmarksgame-team.pages.debian.net/benchmarksgame/).

![Benchmarks Game: k-nucleotide, Mandelbrot, spectral-norm, fasta](/assets/img/go-report/BenchmarksGame.PNG)

**Interpretation**: Go is the most performant, in both CPU time and memory usage. Python is always the slowest[1]. Statically typed languages (C, Java, and Go) outperformed dynamically typed languages (Node.js, Python, PHP).

> [1] You might wonder how Python, with this performance, is used in Machine Learning and Artificial Intelligence. It is because the libraries used such as Numpy and others are written in C/C++ and are wrapped in Python, so you are actually calling C/C++ code from your Python code.

# Where Node.js Stands
The very creator of Node.js, [here](https://belitsoft.com/nodejs-development-services/go-vs-nodejs) in 2017 says:
> “I think Node is not the best system to build a massive server web. I would use Go for that. And honestly, that’s the reason why I left Node. It was the realization that: oh, actually, this is not the best server-side system ever” – **Ryan Dahl**.

He also says:
> “Yeah, I think it’s… for a particular class of application, which is like, if you’re building a server, I can’t imagine using anything other than Go”.

> “So, that plus the fact that Go came out, and I didn’t see Node as being the ultimate solution to servers”.

You may also want to watch [Things I Regret About Node.js – Ryan Dahl – JSConf EU 2018](https://www.youtube.com/watch?v=M3BM9TB-8yA).

**TJ Holowaychuck**, the guy behind the most popular Node.js framework: **Express.js**, among other things, says in 2014: [Farewell Node.js](https://medium.com/@tjholowaychuk/farewell-node-js-4ba9e7f3e52b), and mentions some pain points:
> “I’ve been fighting with Node.js long enough in production now that I don’t enjoy working with it anymore unfortunately, so at least for now this my formal farewell!”

> “I still plan on using Node for web sites.”

> “Moral of the story, don’t get stuck in your own bubble! See what else is out there, you just might enjoy programming again. There are a lot of awesome solutions out there, my mistake was waiting too long to play around with them!☺.”

**Scale Drone** is one of many companies that have seen performance gains after switching to Go:
> “Go servers use a third of the memory that our Node.js servers did. In addition to the memory usage lowering, both response and connections times were reduced significantly” – Scale Drone [(2016 From Node.js to Go)](https://www.scaledrone.com/blog/nodejs-to-go/)

Enough said about Node.js.

# Go at Google

[Robert Love](https://www.quora.com/How-is-Go-used-at-Google-What-could-be-areas-specific-systems-applications-in-which-Go-could-replace-other-languages-used-nowadays-inside-Google-and-why-would-it-make-sense-to-introduce-Go-in-place-of-another-language) who works at Google says:
> “Go is designed specifically as a systems programming language for large, distributed systems and highly-scalable network servers. In that vein, `it replaces C++ and Java in Google` (company)'s software stack. Many teams are looking at building new servers in Go; some are even considering migrating existing codebases. Some of the Google technology you use every day has components written in Go.”

[The Go Team](https://golang.org/doc/faq#creating_a_new_language) says:
> “Go was born out of frustration with existing languages and environments for the work we were doing at Google”. “… Programming had become too difficult and the choice of languages was partly to blame. One had to choose either efficient compilation, efficient execution, or ease of programming; all three were not available in the same mainstream language. Programmers who could were choosing ease over safety and efficiency by moving to dynamically typed languages such as Python and JavaScript rather than C++ or, to a lesser extent, Java”.

Also, see [Rewriting a large production system in Go](http://matt-welsh.blogspot.com/2013/08/rewriting-large-production-system-in-go.html) – By **Matt Welsh**, 2013, in which the prior language used was C++.

# Conclusion
There is a lot to be said about Go itself, maybe that would be a topic for another post. I think Go established itself on the server-side and the cloud, and as a modern general purpose programming language. You should definitely take a look at it.

Read more:
- [Why Go?](https://github.com/golang/go/wiki/WhyGo)
- [Go at Google: Language Design in the Service of Software Engineering](https://talks.golang.org/2012/splash.article)
