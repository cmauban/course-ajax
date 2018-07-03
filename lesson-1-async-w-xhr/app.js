(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const unsplashRequest = new XMLHttpRequest();
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // SEND AN ASYNC REQUEST FOR AN IMAGE FROM A WEBSITE API

        // 1. create an XHR object
        const imgRequest = new XMLHttpRequest();

        // 2. set HTTP method and the URL of the resource to be fetched
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);

        // 3. set this to a func that will run upon a successful fetch
        imgRequest.onload = addImage; // when the unsplashed image returns, it calls the addImage function

        // 4. set this to a functhat will run when an error occurs
        imgRequest.onerror = function (error) {
          requestError(error, 'image');
        };

        imgRequest.setRequestHeader('Authorization', 'Client-ID 3117fd9f785f6c5eceeeda79657a28679b86c789d26b299158c14bb0b7b51582');

        // 5. send the request
        imgRequest.send();


        // request articles from NY times
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles; // when the NY times article returns, it calls the addArticles function
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=fe09ea4030d04edf9c54262f647288fd`);
        articleRequest.send();

    });

    function addImage(){
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      // check to see if image is returned
      if (data && data.results && data.results[0]) {
      const firstImage = data.results[0];

      htmlContent = `<figure><img src="${firstImage.urls.regular}" alt="${searchedForText}"</figure>`;

    } else {
        htmlContent = '<div class="error-no-image">No image available</div>';
    }

      responseContainer.insertAdjacentHTML('afterBegin', htmlContent);
    }


    function addArticles () {
      let htmlContent = '';
      const data = JSON.parse(this.responseText);

      if (data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
        <p>${article.snippet}</p>
        </li>`).join('') + '</ul>';
      } else {
        htmlContent = '<div class="error-no-articles>">No articles available</div>';
      }

      responseContainer.insertAdjacentHTML('beforeBegin', htmlContent);

    }


})();
