# listBoxSelector.js

listBoxSelector.js is *jquery plugin for a pure browser listBox selector generation*.
It allow you to easily add listBox Selector to your webpages.
It is standalone, less then 4k after minify+gzip, no image download.
It doesnt rely on external services which go on and off, or add latency while loading.

Show, dont tell, here is a <a href='https://github.com/majingyu/lbs/blob/master/lbs/index.html'>example</a>


## How to Use It

Let me walk you thru it. First include it in your webpage with the usual script tag
    
    <script type="text/javascript" src="js/listBoxSelector.js"></script>

Then create a DOM element which gonna contains the generated qrcode image. Lets say
a div

    <div id="listBoxSelector" style="width: 800px; height: 600px;"></div>

Then you add the *listBoxSelector* in this container by

    jquery('#listBoxSelector').listBoxSelector({
			left: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7'],
			right: ['item8', 'item9', 'item10'],
			confirm : {
				text: 'OK',
				callback: function (items) {
					console.log(items);
				}
			}
		});

This is it. see it <a href='https://github.com/majingyu/lbs/blob/master/lbs/index.html'>live</a>.

You can get items:

    jquery('#listBoxSelector').listBoxSelector('getItems');


## Conclusion
If you hit bugs, fill issues on github.
Feel free to fork, modify and have fun with it :)
