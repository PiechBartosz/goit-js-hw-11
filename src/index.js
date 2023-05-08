const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.getElementById('load-more');

let searchQuery = '';
let page = 1;
let lightbox;

async function fetchImages(query, page) {
  const apiKey = '36164557-730a1e0f3972fad2bf258714a';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data', error);
  }
}

function createImageCard(imageData) {
  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const imgLink = document.createElement('a');
  imgLink.href = imageData.largeImageURL;
  imgLink.setAttribute('data-lightbox', 'gallery');
  imgLink.setAttribute('data-title', imageData.tags);

  const img = document.createElement('img');
  img.src = imageData.webformatURL;
  img.alt = imageData.tags;
  img.loading = 'lazy';

  imgLink.appendChild(img);

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${imageData.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${imageData.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${imageData.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${imageData.downloads}`;

  info.append(likes, views, comments, downloads);
  photoCard.append(imgLink, info);
  gallery.appendChild(photoCard);
}

function displayImages(images) {
  images.forEach(image => {
    createImageCard(image);
  });
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('a[data-lightbox="gallery"]');
  }
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value;
  page = 1;
  gallery.innerHTML = '';

  const data = await fetchImages(searchQuery, page);
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Brak obrazów pasujących do zapytania. Spróbuj ponownie.'
    );
    return;
  }

  displayImages(data.hits);
  loadMoreButton.style.display = 'block';
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;
  const data = await fetchImages(searchQuery, page);

  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Przepraszamy, ale dotarłeś do końca wyników wyszukiwania.'
    );
    loadMoreButton.style.display = 'none';
    return;
  }

  displayImages(data.hits);
});

loadMoreButton.style.display = 'none';
