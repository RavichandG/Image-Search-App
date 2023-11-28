const images = document.querySelector(".images");
const searchInput = document.querySelector(".search");
/* const loadMoreButton = document.querySelector(".loadMore"); */
const template1 = document.querySelector(".template1");


const api_Key = "zQfz73e6W7tjGEs7uatrBVIXO62NcqK5DEma0ascqReCtuLZs1sqyibh";
let current_page=1;
let current_page_2 = 1;
const per_page = 15;
let searchItem = null;
let throttle_bool = true;

/* function definations */

function getImages(api_url)
{
        searchInput.blur();
        fetch(api_url,{
            headers : {Authorization : api_Key}
        }).then((d)=>{
            return d.json()
        }).then((d1)=>{
            makePhotos(d1.photos)
        }).catch((err)=>{
           console.log(err)
        })
}

function makePhotos(photos)
{
  

    for(let i = 0 ; i <per_page;i++)
    {
         let photo = photos[i];
    

    let clone1 = template1.content.cloneNode(true);
    
    clone1.querySelector(".imageOfCard").setAttribute("src",`${photo.src.large2x}`);
    clone1.querySelector(".photographerName").textContent = `${photo.photographer}`;
    clone1.querySelector(".downloadButton").addEventListener("click",(e)=>{downloadImg(photo.src.large2x)})
    images.appendChild(clone1)
    }
    

    let interSection_ob = new IntersectionObserver((e) => {
      if(e[0].isIntersecting)
      {
        loadmore()
      }
    },{
        threshold : 0
    });
    interSection_ob.observe(images.lastElementChild);
    
}



/* function calls */

getImages(`https://api.pexels.com/v1/curated?page=${current_page}&per_page=${per_page}`)

/* load more button */
/* loadMoreButton.addEventListener("click",loadmore) */
function loadmore(){

   if(throttle_bool)
   {
        throttle_bool = false;
        if(searchItem)
        {
            current_page_2++;
            getImages(
              `https://api.pexels.com/v1/search?query=${searchItem}&page=${current_page_2}&per_page=${per_page}`
            );
        }else{
              current_page++;
              getImages(
                `https://api.pexels.com/v1/curated?page=${current_page}&per_page=${per_page}&page=${current_page}`
              );
        }
       
        setTimeout(()=>{
          throttle_bool = true
        },500)
   }
    

}

/* search button */

searchInput.addEventListener("keyup",(e)=>{
    if(e.key==="Enter")
    {
       let f = images.lastChild;
       while (images.lastChild) {
         images.removeChild(f);
         f = images.lastChild;
       }
       searchItem = e.target.value;

       current_page_2 = 1;
       
        getImages(
          `https://api.pexels.com/v1/search?query=${searchItem}&per_page=${per_page}`
        ); 
    }
    
})

/* download Image */ 

function downloadImg(image_url)
{
     fetch(image_url)
       .then((d) => {
         return d.blob();
       })
       .then((b) => {
         const a = document.createElement("a");
         a.href = URL.createObjectURL(b);
         a.download = new Date().getTime();
         a.click();
       })
       .catch(() => alert("Failed to download image!"));
}

