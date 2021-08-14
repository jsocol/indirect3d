Indirect3D
==========

Indirect3D is an attempt to see just how fast JavaScript in browsers has
gotten. Also it's a chance to try to better understand how some of the
typical 3D graphics pipeline works, by implementing parts of it.


## Quick start guide

To run and work on Indirect3D locally, clone the repository, install the
dependencies, and run `npm run watch`:

```sh
$ git clone git@github.com:jsocol/indirect3d.git
...
$ cd indirect3d
$ npm install
...
$ open index.html
$ npm run watch
```

You can also run the (very few) tests with

```sh
npm run test
// or
npm t
```

## What Indirect3D is

Indirect3D is the (start of) a (partial) pure-software implementation
of the Direct3D 9 graphics API in JavaScript and Canvas.

It uses a few logical, not-currently-overridable, defaults, that
Direct3D does not. For example, z-buffering is always enabled. There is
always a single back buffer. (These two facts are related.)

It also makes pretty heavy use of typed arrays. One consequence is that,
as of this writing, I can only make it run in Firefox 4. Theoretically,
it should run in Chromium, but for some reason, it doesn't. It doesn't
seem to throw any errors, but it doesn't render, either.

Indirect3D is an experiment and toy. It's a fun--to me, anyway--little
project I started late one night.


## What Indirect3D is not

Indirect3D is not a wrapper around WebGL. Hardware is awesome, and the
future of the web, but it is not what I'm interested in here. Maybe
someday I'll write a Direct3D-style wrapper for WebGL. Who knows, maybe
I'll even cover the other DirectX components! (DirectSound => `<audio>`,
DirectPlay => WebSockets, etc.) Probably not, though, that sounds like a
lot of work.

It's certainly not something you should use for anything, except as a
somewhat-difficult-to-explain demo, I guess?


## The Future?

Like most projects, there's a good chance I'll get bored with and stop
work on Indirect3D. It happens a lot.

Before then, I'd like to get all 6 modes for `DrawPrimitive()`
implemented.


## Using Indirect3D

So you ignored my advice in "What Indirect3D is not" and want to use it?
Well, OK, I guess I can help out.

Check out `main.js` for an example program, and brush up on your matrix
math--though, like Direct3D, most of the real math is safely abstracted
away from you.
