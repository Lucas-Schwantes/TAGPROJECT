
//FETCHING FROM JSON

//tornar a url do json numa variável
let url1 = "https://nit.fba.up.pt/dev/wp-json/wp/v2/posts?categories=13";
//fetch o API do TAGGAT
//e mostra esses dados na consola
fetch(url1)
  .then((res) => res.json())
  //.then((dados) => console.log (dados)) 

  //function para construir os posts
  .then(function (dados) {
    //FAZ O SORT DOS DADOS
    dados.sort(function (a, b) {
      return a.acf.data - b.acf.data;
    });
    console.log(dados);

    //CONSTROI AS PAGES E POSTS
    for (let post of dados) {
      buildCorpo(post);
      buildPost(post);
    }
    //outro loop para as imagens de rosto
    for (let post of dados) {
      fetchFeaturedMedia(post.id, post.featured_media);
    }
  });

//construir o corpo e um separador do ano 
function buildCorpo(_post) {
  let corpo = document.createElement("div");
  let separadorAno = document.createElement("div");
  corpo.innerHTML =
    `<div class="corpo-ano" id="corpo-${_post.acf.data}">
    <h1 class="year-header" id="header-${_post.acf.data}">${_post.acf.data}</h1>    
  </div>`;
  separadorAno.innerHTML =
    `<div class="separador-ano" id="ano${_post.acf.data}" onClick="botaoAno(${_post.acf.data})">
    <p>${_post.acf.data}</p>
  </div>`;
  console.log(corpo);
  document.querySelector("#barra-anos").appendChild(separadorAno);
  document.querySelector("#corpo-centro").appendChild(corpo);
  console.log($( ".separador-ano" ).first());
  $( ".separador-ano" ).first().addClass( "separador-ativo" );
}

//construir o post com foto e titulo
function buildPost(_post) {
  // criar o elemento article 
  let elmnt = document.createElement("article");
  let myID = "id-" + _post.id;
  elmnt.setAttribute("id", myID);
  elmnt.setAttribute("class", "entry");

  // string/template literals para construir o post em HTML
  elmnt.innerHTML =
    `
    <a href="registo.html?post=${_post.id}">
    <figure class="imagem-corpo img-wrapper">
       <img class="imgHover" src="">
    </figure>
    </a>
    </div>
     <div class="overlay">
      <h1 class="titulos">${_post.title.rendered}</h1>
     <div class="data_local">
      <span class="data">${_post.acf.data}</span>
      <span class="local">${_post.acf.local}</span>
   `;

   //checar a categoria e atribuir uma classe correspondente que dita a cor do gradient-map da imagem
  if (_post.categories[0] == 52) {
    elmnt.children.item(0).children.item(0).classList.add("img-wrapper-loc");
    console.log(elmnt.children.item(0));
  } else if (_post.categories[0] == 14) {
    elmnt.children.item(0).children.item(0).classList.add("img-wrapper-pes");
    console.log(elmnt.children.item(0));
  } else if (_post.categories[0] == 37) {
    elmnt.children.item(0).children.item(0).classList.add("img-wrapper-art");
    console.log(elmnt.children.item(0));
  }


  // colocar os posts dentro do div pre selecionado no HTML
  //CAPTURA O ANO DO POST ATUAL E COLOCA COMO TARGET O CORPO DO ANO CORRESPONDENTE
  let ano = _post.acf.data;
  console.log(ano);
  document.querySelector("#corpo-" + ano).appendChild(elmnt);
  console.log("built article", elmnt);
  let primeiroAno = $( ".separador-ano" ).first().text();
  let ultimoAno = $( ".separador-ano" ).last().text();
  $('#range-anos').text(primeiroAno+"-"+ultimoAno);
}

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
//ao clicar no separador do ano, dá scroll até o mesmo
function botaoAno(ano) {
  document.getElementById("corpo-" + ano).scrollIntoView({ behavior: 'smooth', block: 'center' });
}


//SCROLL INDICADOR ANO 

$.fn.isInViewport = function () {
  var elementLeft = 0;
  if ($(this).length) {
    elementLeft = $(this).offset().left;
  }
  var elementRight = elementLeft + $(this).outerWidth();
  var viewportLeft = $(window).scrollLeft();
  var viewportRight = viewportLeft + $(window).width();
  return elementRight > viewportLeft && elementLeft < viewportRight;
};


$(window).on('load resize scroll', function() {
  $('.year-header').each(function() {
      var activeYear = $(this).text();
    if ($(this).isInViewport()) {
      $('#ano' + activeYear).addClass('separador-ativo');
      console.log($(this).text());
      $(this).addClass('expand-active');
    } else {
      $('#ano' + activeYear).removeClass('separador-ativo');
      $(this).removeClass('expand-active');
    }
  });
});


//SISTEMA DE FILTRO (onClick desabilita os posts correspondentes)
//o filtro se baseia na classe atribuída anteriormente(na hora de materializar os posts). A classe identifica a categoria e atribui uma cor

//O filtro checa uma variavel global e quando ativo atribui uma classe de "disabled"
let showArt = true;
let showPes = true;
let showLoc = true;

function filtroArt() {
  let posts = document.querySelectorAll(".img-wrapper-art");

  if (showArt == true) {
    for (let post of posts) {
      post.classList.add("disabled");
      document.querySelector("#btn-art").classList.add("disabled");
      showArt = false;
    }
  } else {
    for (let post of posts) {
      post.classList.remove("disabled");
      document.querySelector("#btn-art").classList.remove("disabled");
      showArt = true;
    }
  }

}

function filtroPes() {
  let posts = document.querySelectorAll(".img-wrapper-pes");
  if (showPes == true) {
    for (let post of posts) {
      post.classList.add("disabled");
      document.querySelector("#btn-pes").classList.add("disabled");
      showPes = false;
    }
  } else {
    for (let post of posts) {
      post.classList.remove("disabled");
      document.querySelector("#btn-pes").classList.remove("disabled");
      showPes = true;

    }
  }

}

function filtroLoc() {
  let posts = document.querySelectorAll(".img-wrapper-loc");
  if (showLoc == true) {
    for (let post of posts) {
      post.classList.add("disabled");
      document.querySelector("#btn-loc").classList.add("disabled");
      showLoc = false;
    }
  } else {
    for (let post of posts) {
      post.classList.remove("disabled");
      document.querySelector("#btn-loc").classList.remove("disabled");
      showLoc = true;
    }
  }
}