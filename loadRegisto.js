/* baseado em:
https://www.sitepoint.com/get-url-parameters-with-javascript/ */

//buscar o endereço da url
const queryString = window.location.search;
//faz parse das propriedades da url
const urlParams = new URLSearchParams(queryString);
//receber uma "propriedade"(variavel) da url (post)
const post = urlParams.get("post");

//fetch do post p/ criar conteudo na página
let url = "https://nit.fba.up.pt/dev/wp-json/wp/v2/posts?include=" + post;


//*****mesmo processo da timeline
fetch(url)
  .then(function (resposta) {
    return resposta.json();
  })
  .then(function (dados) {
    for (let post of dados) {
      buildPost(post);
    }

    for (let post of dados) {
        fetchFeaturedMedia(post.id, post.featured_media);
      }
  })

//criar o post na página
  function buildPost(_post) {
    // novo elemento
    let el = document.createElement("article");
    let myID = "id-" + _post.id;
    let titulo = _post.title.rendered;
    el.setAttribute("id", myID);
    $('.barra-topo').append("<p>"+ titulo +"</p>");
      // string/template literals para construir o post em HTML
    el.innerHTML = 
    `
    <div class="conteudo">

    <figure class="imagem-corpo">
    <img class="imgHover" src="">
    </figure>

    <h1 class="titulo">${_post.title.rendered}</h1>
    
    <div class="meta">
    <span class="data">${_post.acf.data}</span>
    <span class="local">${_post.acf.local}</span>
     </div>
    
    <p>${_post.content.rendered}</p>
    </div>

    `;
  
    //colocar o novo post na página
    document.querySelector("#registo").appendChild(el);
  }


//*****mesmo processo da timeline

    //async para as imagens de rosto (1st, outro loop para a function)
    async function fetchFeaturedMedia(_id, _media) {

    //obter a url e adiciona-la ao valor de media ^
    let url2 = "https://nit.fba.up.pt/dev/wp-json/wp/v2/media/";
    url2 += _media;
    let mySrc = "";
    //a variavel "guarda" a info so depois desta carregar, aka, o codigo espera que esta ação seja realizada
    const resposta = await fetch(url2);
    const dados = await resposta.json();
    //definir o tamanho da imagem de rosto como o seu tamanho real
    mySrc = dados.guid.rendered;
  
    // por fim colocar as iamgens no article > figure > img e no "src"
    let newID = "#id-" + _id;
    console.log(newID)
    let newEl = document.querySelector(newID);
    newEl.children.item(0).children.item(0).children.item(0).setAttribute("src", mySrc);
  }