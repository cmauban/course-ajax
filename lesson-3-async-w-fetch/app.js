(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;


      // fetch unsplash images
      fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
          headers: {
              Authorization: 'Client-ID 3117fd9f785f6c5eceeeda79657a28679b86c789d26b299158c14bb0b7b51582'
          }
      }).then(response => response.json())
      .then(addImage)
      // if there is an error this calls the requestError func
      .catch(e => requestError(e, 'image'));


      // fetch NY TIMES articles
      fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=fe09ea4030d04edf9c54262f647288fd`).then(response => response.json())
      .then(addArticles)
      .catch(error => requestError(error, 'articles'));


      function addImage(data) {
        let htmlContent = '';
        const firstImage = data.results[0];

         if (firstImage) {
             htmlContent = `<figure>
                 <img src="${firstImage.urls.small}" alt="${searchedForText}">
                 <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
             </figure>`;
         } else {
             htmlContent = 'Unfortunately, no image was returned for your search.'
         }

       responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
      }

    // if theres an error
    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }

    function addArticles(art) {
      let htmlContent = '';

      if (art.response && art.response.docs && art.response.docs.length > 1) {
        htmlContent = '<ul>' + art.response.docs.map(article => `<li class="article">
        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
        <p>${article.snippet}</p>
        </li>`).join('') + '</ul>';
      } else {
        htmlContent = '<div class="error-no-articles>">No articles available</div>';
      }

     responseContainer.insertAdjacentHTML('beforeBegin', htmlContent);
    }



    });
})();
