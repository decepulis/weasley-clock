# Magic Mirror JAMStack Weasley Clock

I've been wanting to build a [Weasley Clock](https://harrypotter.fandom.com/wiki/Weasley_Clock) for a long time. It's really the perfect IoT project. Some cell phone location data, a Raspberry Pi or Arduino, a bit of clockwork, and you've got something that seems like magic. 

Like any good programmer, I got started by googling to see if I could find anyone who's already solved the problem. [As](https://magicclock.de) [it](https://randomstring2.blogspot.com/2020/05/weasley-location-clock-project.html) [turns](https://create.arduino.cc/projecthub/order-of-the-bolt-nix/harry-potter-weasleys-clock-using-bolt-iot-a7d04a) [out](https://www.instructables.com/Functional-Weasley-Clock/), [I](https://imgur.com/a/EAhKH#eBGdoEa) [could](https://imgur.com/gallery/me3Ug#AF7QRaL)! And, after reading through all of them, I decided that, without woodworking tools or a 3D printer, I was _not_ equipped to build a nice clock. At least not yet. 

But that's ok. I'm a web developer. I made a website instead, and put it in a picture frame behind a mirror to make it look pretty.

<img width="300" alt="a mirror in a picture frame; behind the mirror shines through a clock with hands pointing not at times, but rather at locations. Home, Work, Gym, and more." src="https://user-images.githubusercontent.com/8933386/106194075-fbe2a500-6173-11eb-9baf-52d6bd9dab6a.jpeg"/>

## Software & Cloud
### Location (Owntracks)
Taking inspiration from [the best Weasley Clock guide](https://www.instructables.com/Build-Your-Own-Weasley-Location-Clock/) I found so far, I decided to use [Owntracks](https://owntracks.org) to tap into our iPhones' [Significant-Change Location Service](https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_significant-change_location_service) to get our whereabouts without taking down our batteries or compromising our security. Every time we move outside a certain radius (say, 250m), our iPhones fire up Owntracks which in turn shoots off location over MQTT or HTTP.

But where is it shooting that location to?

### Location Storage (Netlify Functions + FaunaDB)
At first, I wanted to host a full-stack site on my Raspberry Pi at home. But almost immediately, I ran into the classic issue of hosting at home: [DDNS](https://en.wikipedia.org/wiki/Dynamic_DNS). At that point, I could either dive back into that DDNS world which I hadn't touched since my Minecraft server years ago, or...

Well. I'm a web developer. I used _the cloud_ instead.
I've been having a fun time hosting static sites on Netlify for a while now. This seemed like as good an opportunity as ever to dive into the rest of the [JAMstack](https://jamstack.wtf) and figure out what all the [serverless](https://www.serverless.com) hype was all about.

After poking around, it seemed like [FaunaDB](https://fauna.com) was a good serverless persistence layer. With an okay free plan, too. And how could I get data _to_ FaunaDB? Well, my best friend Netlify had [just the service for that](https://www.netlify.com/products/functions/). The two even had a [nice example](https://github.com/netlify/netlify-faunadb-example) I could follow.

### Front-End (Svelte)
With all that back-end stuff out of the way, let's get to the fun stuff. Time to build a clock. For the front-end, I chose Svelte. Because [Svelte is just nice](https://www.youtube.com/watch?v=AdNJ3fydeao).

It didn't take more than a day to build a quick and slick clock that did all the things: pulling data from FaunaDB with Netlify Functions on an interval, displaying a pretty clock with SVG, playing a chime when a hand moved, animating everything with some [satisfying springs](https://svelte.dev/tutorial/spring)... _bam_.

<img width="300" alt="image" src="https://user-images.githubusercontent.com/8933386/106191381-698cd200-6170-11eb-8856-385d44bfad0e.png">

Really the most difficult part was dynamically setting the interval so that I wouldn't exceed any of my free-tier limits. This is where it would've been nice to have a traditional server that notified the front-end over a websocket whenever there was new data, but that's just not something serverless is set up for. Oh well.

### ETA (Netlify Functions + Google Maps API)
Oh wait! There's one more bit of back-end that I have to talk about. After receiving a location from Owntracks/FaunaDB, the front-end can optionally request an ETA for someone. And that feature was built using the Google Maps [Directions API](https://developers.google.com/maps/documentation/directions/overview), and again, Netlify Functions. I can even switch between driving and transit; something I'm totally planning on implementing maybe. Cool!

## Hardware
So I really was sad that I couldn't build a nice physical clock like those links up above. I didn't want to just have some computer screen hanging on a wall, showing a clock on some website. I wanted it to be a physical object, not a digital object. So I did the best I could and finally built that [magic mirror](https://www.raspberrypi.org/blog/magic-mirror/) I've been wanting to build.

Taking cues from a [MagPi article](https://magpi.raspberrypi.org/articles/build-a-magic-mirror) I had saved as well as [this nice forum thread](https://forum.magicmirror.builders/topic/1775/where-to-buy-2-way-mirror-in-usa) I put together my BOM:
- [An IKEA Frame](https://www.ikea.com/us/en/p/ribba-frame-black-40378420/)
- [An 8x10" Two-Way Mirrored Acryllic](https://www.tapplastics.com/product/plastics/cut_to_size_plastic/two_way_mirrored_acrylic/558)
- [A low-profile 9.7" LCD](https://shop.pimoroni.com/products/hdmi-10-lcd-screen-kit-1024x768)
- [A Raspberry Pi 3B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/) I had lying around
- [A 2.5A Micro-USB Switched Power Supply](https://www.amazon.com/CanaKit-Raspberry-Supply-Adapter-Listed/dp/B00MARDJZ4/)
- [A short micro-usb cable to power the display](https://www.amazon.com/gp/product/B017NJW2T2/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1)
- [A short HDMI cable to connect it to the Pi](https://www.amazon.com/gp/product/B07DVDZM41/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1)
- [USB Speakers](https://www.adafruit.com/product/3369?gclid=Cj0KCQiA6t6ABhDMARIsAONIYyy2s0bJo0vEVb9XcrXjEUWlWhc_mSBNOj5DJfaf2vEM2jk1lyAlI-MaAhBtEALw_wcB) which required some busting out of their case and minor re-soldering
- [And a little bit of mounting tape](https://www.amazon.com/gp/product/B00004Z498/)

Put them all together, [set up the Pi's OS](https://www.youtube.com/watch?v=J024soVgEeM), start the Pi in [kiosk mode](https://wolfgang-ziegler.com/blog/setting-up-a-raspberrypi-in-kiosk-mode-2020), and _bam_. 

<img width="300" alt="a mirror in a picture frame; behind the mirror shines through a clock with hands pointing not at times, but rather at locations. Home, Work, Gym, and more." src="https://user-images.githubusercontent.com/8933386/106194075-fbe2a500-6173-11eb-9baf-52d6bd9dab6a.jpeg"/>
<img width="300" alt="The wiring behind the picture frame; a Raspberry Pi hooked up to a display driver, whose ribbon runs through the back of the frame to the front" src="https://user-images.githubusercontent.com/8933386/106533148-396a6980-64b7-11eb-944c-915894717e07.jpeg"/>

Magic Mirror JAMStack Weasley Clock.


## Licenses
Sound effects obtained from https://www.zapsplat.com
