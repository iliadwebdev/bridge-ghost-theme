/* SOME ELEMENT LOGIC */

setNotification();
setNavigation();
secondLevelMenu();
setToggle();


/* CUSTOM ELEMENTS */

if (!customElements.get('section-header')) {
    customElements.define('section-header', class SectionHeader extends HTMLElement {
        constructor() {
        super(); 

        this.previousBtn = this.querySelector('.section-header-arrows button[name=left]');
        this.nextBtn = this.querySelector('.section-header-arrows button[name=right]');
    }

    sliderSetup(slider) {
        let sliderInner = slider.firstElementChild;

        this.checkArrows(sliderInner);
        
        this.nextBtn.addEventListener('click', (e) => {
            sliderInner.scroll({
                left: this.calculatePosition(sliderInner, "next"),
                behavior: 'smooth'
            });
        })

        this.previousBtn.addEventListener('click', (e) => {
            let slideWidth = sliderInner.firstElementChild.offsetWidth;
            sliderInner.scroll({
                left: this.calculatePosition(sliderInner, "previous"),
                behavior: 'smooth'
            });
        })

        sliderInner.addEventListener('scroll', debounce(() => {
            this.checkArrows(sliderInner);
        }, 10))
    }

    calculatePosition(sliderInner, slide){        
        let currentPosition = sliderInner.scrollLeft;
        let slideWidth = sliderInner.firstElementChild.offsetWidth;
        let nextPosition = 0;
        if(slide == "next"){
            nextPosition = (~~(currentPosition / slideWidth) + 1) * slideWidth;  
        }else {
            if(~~(currentPosition / slideWidth) == (currentPosition / slideWidth)){
                nextPosition = (~~(currentPosition / slideWidth) -1) * slideWidth;
            }else{
                nextPosition = (~~(currentPosition / slideWidth) + 0) * slideWidth;
            }                
        }           

        return nextPosition;
    }   

    checkArrows(sliderInner){
        sliderInner.scrollLeft <= 0 ? this.previousBtn.setAttribute("disabled", '') : this.previousBtn.removeAttribute("disabled");
        sliderInner.scrollLeft >= (sliderInner.scrollWidth - sliderInner.offsetWidth) ? this.nextBtn.setAttribute("disabled", '') : this.nextBtn.removeAttribute("disabled");
    }
})
}

if (!customElements.get('custom-slider')) {
    customElements.define('custom-slider', class CustomSlider extends HTMLElement {
        constructor() {
        super(); 
        
        this.controller = document.getElementById(this.id.toString().concat("-controller"))
        this.controller.sliderSetup(this);
        this.sliderInner = this.querySelector('.slider-inner');

        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging;

        this.sliderInner.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(event) {
                if (isDragging) {
                    event.preventDefault(); // Prevent navigation
                }
            });
        })

        this.sliderInner.addEventListener('mousedown', (e) => {
            isDown = true;
            this.sliderInner.classList.add('active-grab');
            startX = e.pageX - this.sliderInner.offsetLeft;
            scrollLeft = this.sliderInner.scrollLeft;
        });

        this.sliderInner.addEventListener('mouseleave', () => {
            isDown = false;
            this.sliderInner.classList.remove('active-grab');

            setTimeout(() => {
                isDragging = false;
                this.sliderInner.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', this.stopProp) 
                });
            }, 10);
        });

        this.sliderInner.addEventListener('mouseup', (e) => {
            isDown = false;
            this.sliderInner.classList.remove('active-grab');

            setTimeout(() => {
                isDragging = false;
                this.sliderInner.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', this.stopProp)               
                });
            }, 10);
        });

        this.sliderInner.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.sliderInner.offsetLeft;
            const walk = (x - startX);
            this.sliderInner.scrollLeft = scrollLeft - walk;
            this.sliderInner.querySelectorAll('a').forEach(link => {
                isDragging = true;
            })
        });
    }

    stopProp(event){
        event.stopPropagation(); // Enable navigation
        event.target.removeEventListener('click', this.stopProp);
    }
})
}

if (!customElements.get('custom-pagination')) {
    customElements.define('custom-pagination', class CustomPagination extends HTMLElement {
        constructor() {
        super(); 
        
        this.loadMoreBtn = this.querySelector("#load-more-btn");
        
        if(this.loadMoreBtn){
            this.loadMoreBtn.addEventListener("click", () => {
                this.loadMorePosts();
            });
        }
    }

    loadMorePosts() {
        let currentPage = parseInt(this.loadMoreBtn.getAttribute("data-current-page"));
        let nextPage = currentPage + 1;
        let url = window.location + `page/${nextPage}/`;


        // Make the AJAX request
        fetch(url)
            .then(response => response.text())
            .then(data => {
                let parser = new DOMParser();
                let html = parser.parseFromString(data, "text/html");
                let grid = document.querySelector(".pagination-grid");
                let newPosts = html.querySelector(".pagination-grid").innerHTML;
                
                // Append the new posts to the existing ones
                grid.insertAdjacentHTML("beforeend", newPosts);

                // Update the "Load more" button attributes
                this.loadMoreBtn.setAttribute("data-current-page", nextPage);
                this.loadMoreBtn.style.display = html.querySelector("#load-more-btn") ? "block" : "none";
            })
            .then(() => {
                calculateTextHeight(calcHeightContainers);
            })
            .catch(error => {
                console.error("Error loading more posts:", error);
            });
    }
})
}

if (!customElements.get('custom-footer')) {
    customElements.define('custom-footer', class CustomFooter extends HTMLElement {
        constructor() {
        super(); 
        
        this.form = this.querySelector('form');
        
        if(!this.form) {
            this.querySelector('.footer-subscribe-heading').innerHTML = this.querySelector('#no-footer-form-text').getAttribute("data-no-footer-form-text");
            this.querySelector('.action-wrapper').style.marginTop = '0px';
        }
    }
})
}

if (!customElements.get('membership-tiers')) {
    customElements.define('membership-tiers', class MembershipTiers extends HTMLElement {
        constructor() {
        super(); 

        this.setRows();
    }

    setRows(){
        let row;
        let currency;

        this.querySelectorAll('.tier-card').forEach((card, index) => {
            if(index % 3 === 0){
                row = document.createElement("div");
                row.classList.add("membership-row");
                this.appendChild(row);
            }

            let cardText = card.querySelector('h1').innerText;
            currency = card.querySelector('.price-format').innerText;

            if(!cardText){
                card.querySelector('h1').innerHTML = "0"
            }
            
            row.appendChild(card)
        })

        let freePlanCurrency = this.querySelectorAll('.tier-card .price-format')[0];

        if(freePlanCurrency && freePlanCurrency.textContent.trim() == "")
        {
            currency == null ? freePlanCurrency.textContent = "$" : freePlanCurrency.textContent = currency;
        }

        this.querySelectorAll('.membership-row').forEach(row => {
            let cards = row.querySelectorAll('.tier-card')
            switch(cards.length) {
                case 1:
                    cards[0].classList.add('membership-full-border');
                    break;

                case 2:
                    cards[0].classList.add('membership-left-border');
                    break;
            
                default:
                    break;
            }
        })
    }
})
}

if (!customElements.get('custom-membership')) {
    customElements.define('custom-membership', class CustomMembership extends HTMLElement {
        constructor() {
        super(); 

       this.querySelectorAll('.membership-button').forEach(button => {
        button.addEventListener('click', this.tabChange.bind(this))
       })

       if(this.querySelector('.tier-card')){
            document.querySelector('.membership-section').style.display = "flex";
       }
    }

    tabChange(e) {
        if(e.target.getAttribute('data-inactive') == "true"){
            e.target.setAttribute('data-inactive', "false");
            let name = e.target.getAttribute('data-tab')
            this.querySelector(`membership-tiers[data-tab-content=${name}]`).setAttribute('data-inactive', "false")
    
            let oposite;
            name == "yearly" ? oposite = "monthly" : oposite = "yearly"
    
            this.querySelector(`.membership-button[data-tab=${oposite}]`).setAttribute('data-inactive', "true");
            this.querySelector(`membership-tiers[data-tab-content=${oposite}]`).setAttribute('data-inactive', "true")
        }   
    }
})
}

if (!customElements.get('custom-form')) {
    customElements.define('custom-form', class CustomForm extends HTMLElement {
        constructor() {
        super(); 

        const formElement = this.querySelector('form');
        const formSmallText = this.querySelector('.form-small-text');
        const heading = document.querySelector('.full-screen h1');
        const description = document.querySelector('.full-screen .hero-description-wrapper p');
        const homeButton = document.querySelector('.full-screen .back-home-button');
        const formType = this.querySelector('form').getAttribute('data-members-form');
        const successHeading = this.querySelector("#form-success-heading-text").getAttribute('data-success-heading');
        const successParagraph = this.querySelector("#form-success-paragraph-text").getAttribute('data-success-paragraph');
        
        let success = false;
        const observer = new MutationObserver(function(mutationsList) {
          for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const classList = mutation.target.classList;
              if (classList.contains('success') && !success) {
                success = true;
        
                formElement.style.display = "none";
                if(formSmallText){
                    formSmallText.style.display = "none";
                }
                heading.innerHTML = successHeading;
                homeButton.style.display = "block";

                description.innerHTML = successParagraph;
              }
            }
          }
        });
        
        observer.observe(formElement, { attributes: true });
    }
})
}

if (!customElements.get('custom-card')) {
    customElements.define('custom-card', class CustomCard extends HTMLElement {
        constructor() {
        super(); 

        const chars = this.getAttribute('data-chars');
        const textContainer = this.querySelector('.truncate');
        const text = textContainer.textContent.trim();

        if (text.length > chars) {
            const truncatedText = text.slice(0, chars) + '...';
            textContainer.textContent = truncatedText;
        }
    }
})
}

if (!customElements.get('custom-header')) {
    customElements.define('custom-header', class CustomHeader extends HTMLElement {
        constructor() {
        super();

        this.apiKey = this.getAttribute('data-content-api-key');
        if(this.apiKey){
            this.currentRootUrl = window.location.protocol + '//' + window.location.host;
            this.apiUrl = `${this.currentRootUrl}/ghost/api/content/`;
            this.searchUrl = `${this.apiUrl}posts/?key=${this.apiKey}`;
            this.header = this.querySelector('#custom-search-header');
            this.searchItemsContainer = this.querySelector('.tags-grid');
            this.numberText = this.querySelector('.section-header-number .big-text');
            this.searchInput = this.querySelector('.search-input');
            this.customSearch = this.querySelector('.custom-search');
            this.blurDiv = document.querySelector('.blur');
            this.shownData = [];
            this.navbarTexts = this.querySelector("#navbar-texts");
    
            this.searchInput.addEventListener('input', this.setCustomSearch.bind(this))
            this.searchInput.addEventListener('focus', this.openSearchDesktop.bind(this))
            document.addEventListener("keydown", this.closeSearch.bind(this));
            document.addEventListener("click", this.closeSearch.bind(this));
            this.querySelector('.search-icon-close').addEventListener('click', this.closeSearch.bind(this));
            this.querySelector('.search-icon-wrapper-mobile').addEventListener('click', this.mobileSearchOpen.bind(this))
        }
    }

    openSearchDesktop(){
        if(window.matchMedia('(min-width: 992px)').matches){
            this.openSearch();
        }
    }

    openSearch(){
        if(this.customSearch.getAttribute('isopen') == 'true') return;

        this.customSearch.style.display = "block";
        disableScrolling();
        this.blurDiv.style.display = 'block';
        this.blurDiv.classList.add('blur-lower-index');
        this.querySelector('.search-icon-open').style.display = "none";
        this.querySelector('.search-icon-close').style.display = "flex";
        this.customSearch.setAttribute("isopen", true);
    }

    mobileSearchOpen(){
        if(document.querySelector('.menu').getAttribute('isopen') == "true"){
            const closeMenuEvent = new Event('click');
            this.querySelector('.menu-button').dispatchEvent(closeMenuEvent);
        }

        this.querySelector('.menu-top').style.display = "none";
        this.querySelector('.search-bar-wrapper').style.display = "flex";
          
        this.openSearch();

        this.searchInput.focus();
    }

    closeSearch(e){
        if(this.customSearch.getAttribute('isopen') == 'false') return;

        if(e.target == this.blurDiv || e.key === "Escape" || e.target == this.querySelector('.search-icon-close')){
            this.closeSearchHandler();
        }
    }

    closeSearchHandler(){
        this.customSearch.style.display = "none";
        enableScrolling();
        this.customSearch.setAttribute("isopen", false);
        this.blurDiv.style.display = 'none';
        this.blurDiv.classList.remove('blur-lower-index');
        this.searchInput.blur();
        this.querySelector('.search-icon-open').style.display = "block";
        this.querySelector('.search-icon-close').style.display = "none";
        this.querySelector('.menu-top').style.display = "flex";

        this.searchInput.value = ''; 
        const event = new Event('input');
        this.searchInput.dispatchEvent(event);
    }

    setCustomSearch(e){
        let searchTerm = e.target.value;

        if(searchTerm == ""){
            this.header.querySelector('h2').innerHTML = null;
            this.searchItemsContainer.style.display = "none";
            this.numberText.innerHTML =  this.navbarTexts.getAttribute('data-no-results');
        }else{
            fetch(this.searchUrl)
            .then(response => response.json())
            .then(data => {
                var filteredPosts = data.posts.filter(post => {
                    const lowercaseSearchTerm = searchTerm.toLowerCase();
                    const lowercaseTitle = post.title.toLowerCase();
                    const lowercaseExcerpt = post.excerpt.toLowerCase();
                  
                    return lowercaseTitle.includes(lowercaseSearchTerm) || lowercaseExcerpt.includes(lowercaseSearchTerm);
                  }).slice(0, 20);
                
                this.header.querySelector('h2').innerHTML = `"${searchTerm}"`;
                this.searchItemsContainer.style.display = "grid";
                this.numberText.innerHTML = `${filteredPosts.length} ${this.navbarTexts.getAttribute('data-results')}`;
    
                this.shownData = [];
    
                this.searchItemsContainer.querySelectorAll('.tag-card').forEach(item => {
                    if(filteredPosts.every(it => it.id !== item.id)){
                        item.remove();
                    }else{
                        let arrayItem = filteredPosts.filter(it => it.id === item.id)[0];
                        this.shownData.push(arrayItem)
                    }
                })
    
                filteredPosts.forEach(post => {
                    if(this.shownData.some(it => it.id === post.id)) return;
    
                    this.shownData.push(post.id);
    
                    let searchItem = document.createElement('div');
                    searchItem.classList.add('tag-card');
                    searchItem.id = post.id;
    
                    let alt;
                    post.feature_image_alt == null ? alt = post.title : post.feature_image_alt;
    
    
                    let imageUrl = post.feature_image;
                    let image;
    
    
                    if(imageUrl){   
                        image = `
                            <figure>
                                <img
                                    srcset="${findSrcSet(imageUrl, '300')} 300w,
                                    ${findSrcSet(imageUrl, '720')} 720w,
                                    ${findSrcSet(imageUrl, '960')} 960w"
                                    src="${post.feature_image}"
                                    alt="${alt}"
                                >
                            </figure>      
                        `;
                    }else{
                        image = `
                        <div class="placeholder">
                            <svg class="placeholder-svg" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42 119H126L99.75 84L78.75 112L63 91L42 119ZM21 147V21H147V147H21ZM35 133H133V35H35V133Z" fill="var(--text-color)"></path>
                            </svg>
                        </div>   
                        `
                    }
    
                    searchItem.innerHTML = `
                        <a href="${post.url}" class="card-image-link">                 
                            ${image}            
                        </a>
                        <a class="tag-heading-link" href="${post.url}">
                            <div class="big-text">${post.title}</div>
                        </a>
                    `;

                    var searchItemTitle = searchItem.querySelector('.tag-heading-link .big-text');
                    var searchItemTitleText = searchItemTitle.textContent.trim();

                    if (searchItemTitleText.length > 40) {
                        const truncatedText = searchItemTitleText.slice(0, 40) + '...';
                        searchItemTitle.textContent = truncatedText;
                    }
    
                    this.searchItemsContainer.appendChild(searchItem);
                }) 
            })
            .catch(error => {
                console.error(error.message);
            });  
        }  
    }  
})
}