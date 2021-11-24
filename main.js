class photoGallery {

    constructor(){
        this.Api_key = '563492ad6f917000010000018795bb3604dc4647bd5bfddea7000cfe';
        this.gallery = document.querySelector('.gallery');
        this.loadMore = document.querySelector('.loadMore');
        this.pageIndex = 1;
        this.searchForm = document.querySelector('main form')
        this.searchValueGlobal = '';
        this.home = document.querySelector('.home');
        this.goBack = document.querySelector('.goBack');
        this.eventHandler();
    }

    eventHandler(){
     document.addEventListener('DOMContentLoaded', () => {
         this.getImg(1);
     });   
     this.loadMore.addEventListener('click', (e) =>{
        this.loadMoreImages(e);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 180;
     });
     this.searchForm.addEventListener('submit', (e) =>{
         this.pageIndex = 1;
        this.getSearchedImages(e)
     });

     this.home.addEventListener('click', () =>{
         this.pageIndex = 1;
         this.gallery.innerHTML = '';
         this.getImg(this.pageIndex);
     });

     this.goBack.addEventListener('click', () =>{
         this.pageIndex = --this.pageIndex;
         this.gallery.innerHTML = '';
         this.getImg(this.pageIndex);

         document.body.scrollTop = 0;
         document.documentElement.scrollTop = 0;
     })
    }

    async getImg(index){
        this.loadMore.setAttribute('data-img','curated');
        const baseUrl = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchPhotos(baseUrl);
        this.gallery.innerHTML = '';

        this.generateHtml(data.photos);
        console.log(data);
    }

    async fetchPhotos(baseUrl){
        const response = await fetch(baseUrl,{
            method: 'GET',
            headers:{
                Accept:'application/json',
                Authorization: this.Api_key
            }
        });
        const data = await response.json();
        return data;
    }
    generateHtml(photos){
        photos.forEach(photo =>{
            const item = document.createElement('div');
            item.classList.add('col-md-6', 'col-sm-12', 'col-lg-3');
            item.innerHTML = `
            <a href='${photo.src.original}' target='_blank'>
            <img style='width: 240px; height:400px; object-fit:cover;' class='img-fluid py-2 img-rounded ' loading='lazy' src='${photo.src.large}'>
            </a>
            <div class='card-text'>
                <h6>Photographer:'${photo.photographer}' </h6>
            </div>
            `;
            this.gallery.appendChild(item);
        })
    }

    loadMoreImages(e){
        let index = ++this.pageIndex;
        this.getImg(index)
    }

    async getSearchedImages(e){

        this.loadMore.setAttribute('data-img','search');
        e.preventDefault();
        const searchValue = e.target.querySelector('input').value;

        this.searchValueGlobal = searchValue;
        const baseUrl =  `https://api.pexels.com/v1/search?query=${searchValue}&per_page=12`;
        const data = await this.fetchPhotos(baseUrl);
        this.gallery.innerHTML = '';
        this.generateHtml(data.photos);

        e.target.reset();

    }

    async getMoreSearchedImages(index){
        const baseUrl = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
        const data = await this.fetchPhotos(baseUrl);
        this.gallery.innerHTML = '';

        this.generateHtml(data.photos);
    }

    loadMoreImages(e){
        let index = ++this.pageIndex;
        const loadMoreData =  e.target.getAttribute('data-img');
        if(loadMoreData === 'curated'){
            this.getImg(index)
        }else{
            this.getMoreSearchedImages(index)
        }
    }

}

const gallery = new photoGallery;
