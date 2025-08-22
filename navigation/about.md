---
layout: post
title: About
permalink: /about/
comments: true
---

## Hi!! My name is Shayan, i'm 15 years old


Here are some places I have lived.

- California, moved here at around 6 years old and I have loved living here

- Texas, born in Dallas, I lived here for about 4 years and I don't remember much about it.


<!-- This grid_container class is used by CSS styling and the id is used by JavaScript connection -->
<div class="grid-container" id="grid_container">
    <!-- content will be added here by JavaScript -->
</div>

<script>
    // 1. Make a connection to the HTML container defined in the HTML div
    var container = document.getElementById("grid_container"); // This container connects to the HTML div

    // 2. Define a JavaScript object for our http source and our data rows for the Living in the World grid
    var http_source = "https://upload.wikimedia.org/wikipedia/commons/";
    var living_in_the_world = [
        {"flag": "0/01/Flag_of_California.svg", "greeting": "I love SoCal!", "description": "California on top!!"},
    ];

    // 3a. Consider how to update style count for size of container
    // The grid-template-columns has been defined as dynamic with auto-fill and minmax

    // 3b. Build grid items inside of our container for each row of data
    for (const location of living_in_the_world) {
        // Create a "div" with "class grid-item" for each row
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";  // This class name connects the gridItem to the CSS style elements
        // Add "img" HTML tag for the flag
        var img = document.createElement("img");
        img.src = http_source + location.flag; // concatenate the source and flag
        img.alt = location.flag + " Flag"; // add alt text for accessibility

        // Add "p" HTML tag for the description
        var description = document.createElement("p");
        description.textContent = location.description; // extract the description

        // Add "p" HTML tag for the greeting
        var greeting = document.createElement("p");
        greeting.textContent = location.greeting;  // extract the greeting

        // Append img and p HTML tags to the grid item DIV
        gridItem.appendChild(img);
        gridItem.appendChild(description);
        gridItem.appendChild(greeting);

        // Append the grid item DIV to the container DIV
        container.appendChild(gridItem);
    }
</script>

### Journey through Life

Here is what I have done in San Diego

-  Visit many different beaches
-  Graduate from elementary and middle school
-  Went to Padres games
-  Went to amusment parks
-  Took speech and math classes outside of school
-  Played football for 5 years

### Culture, Family, and Fun

Things I love and appreciate most are God, Family, and Friends, in that order.

- I have been a muslim my whole life and really like my religion because it is very peacful and it makes me a better person to others
- I am Pakistani, never really lived there for more than a year, but I still love that country
- For fun I like to go to the park and play basketball or go to a sports park and play football with my friends
- My favorite things to do are: Spend time with family/friends, play sports, study without being forced to, and sleep

<comment>
Here are some pics of my family, friends, and things I do for fun!
</comment>
<div class="image-gallery">
  <img src="{{site.baseurl}}/images/about/fam.png" alt="Image 1">
  <img src="{{site.baseurl}}/images/about/meccafam.png" alt="Image 2">
  <img src="{{site.baseurl}}/images/about/fg.png" alt="Image 3">
  <img src="{{site.baseurl}}/images/about/meandbilly.png" alt="Image 4">
  <img src="{{site.baseurl}}/images/about/coolview.png" alt="Image 5">
  
</div>
