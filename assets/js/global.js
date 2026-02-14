/* Global Notifications */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setNotification() {
    var action = getParameterByName('action');
    var stripe = getParameterByName('stripe');
    var success = getParameterByName('success');

    document.addEventListener('DOMContentLoaded', function() {
        if(success == null && action == null && stripe == null) return;

        var notifications = document.querySelector('.global-notifications');
        if(stripe){
            notifications.classList.add(`stripe-${stripe}`);

            notifications.addEventListener('animationend', () => {
                notifications.classList.remove(`stripe-${stripe}`);
            });
        }else{
            notifications.classList.add(`${action}-${success}`);

            notifications.addEventListener('animationend', () => {
                notifications.classList.remove(`${action}-${success}`);
            });
        }
    });
}

let scrollPosition = 0;

function disableScrolling() {
  scrollPosition = window.pageYOffset;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  document.documentElement.style.scrollBehavior = 'auto';
}

function enableScrolling() {
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('width');
  window.scrollTo(0, scrollPosition);
  document.documentElement.style.scrollBehavior = 'smooth';
}

function hexToRGBA(hexColor, opacity) {
    const hex = hexColor.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function secondLevelMenu(){
    //NAVBAR
    let navArray = [];
    const navbar = document.querySelector('.nav');
    if(navbar){
        navbar.querySelectorAll('li').forEach(link => {         
            if (link.dataset.label.charAt(0) === "-") {
                link.dataset.parent = link.dataset.label.substring(1);                               
                if(link.dataset.label.includes("--")){
                    var data = link.dataset.parent.split("--")
                    link.dataset.parent = data[0];
                    link.dataset.child = data[1];
                    
                    link.querySelector('.nav-link').innerHTML = link.dataset.child;
                    navArray.push({parent: data[0], child: link});
                }else{
                    link.querySelector('.nav-link').innerHTML = link.dataset.parent;  
    
                    const anchor = link.querySelector('a');
                    const div = document.createElement('div');
                    const ul = document.createElement('ul');
    
    
                    div.innerHTML = anchor.innerHTML;
                    div.classList.add('links-label')
                    div.dataset.label = link.dataset.parent;
                    anchor.parentNode.replaceChild(div, anchor);
    
                    link.appendChild(ul);
                    ul.classList.add('secondary-links');
                }               
            }
        })
    
        //move links
        navArray.forEach(item => {
            var secondaryList = document.querySelector(`.nav div.links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
            secondaryList.appendChild(item.child)
        })
    }

    //FOOTER
    navArray = [];
    const footerNav = document.querySelector('.footer-nav');
    if(footerNav){
        footerNav.querySelectorAll('li').forEach(link => {         
            if (link.dataset.label.charAt(0) === "-") {
    
                link.dataset.parent = link.dataset.label.substring(1);
                if(link.dataset.label.includes("--")){
                    var data = link.dataset.parent.split("--")
                    link.dataset.parent = data[0];
                    link.dataset.child = data[1];
                    
                    link.querySelector('.footer-nav-link').innerHTML = link.dataset.child;
                    navArray.push({parent: data[0], child: link});
                    }
                    else{
                    link.querySelector('.footer-nav-link').innerHTML = link.dataset.parent;  
    
                    const anchor = link.querySelector('a');
                    const div = document.createElement('div');
                    const ul = document.createElement('ul');
                    const groupUl = document.createElement('ul')
    
    
                    div.innerHTML = anchor.innerHTML;
                    div.classList.add('footer-links-label')
                    groupUl.classList.add('footer-links-group')
                    div.dataset.label = link.dataset.parent;
                    anchor.parentNode.replaceChild(div, anchor);
    
                    link.appendChild(ul);
                    ul.classList.add('footer-secondary-links');
    
                    
                    document.querySelector('.footer-navigation').appendChild(groupUl)
                    groupUl.appendChild(link)
    
    
                    if (footerNav.hasAttribute('center')) {
                        link.style.alignItems = "center";
                        ul.style.justifyContent = "center";
                    }
                }    
            }
        })

        //move links
        navArray.forEach(item => {
            var secondaryList = document.querySelector(`custom-footer div.footer-links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
            secondaryList.appendChild(item.child)
        })

        if (footerNav.hasAttribute('center')) {
            footerNav.style.justifyContent = "center"
        }

        if(footerNav.children.length === 0){
            footerNav.remove();
        }   
    }     
}

function debounce(fn, delay) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
}

function setNavigation(){
    const menuBtn = document.querySelector('.menu-button');
    const menu = document.querySelector('.menu');
    const menuContent = document.querySelector('.menu-content');
    const sidebar = document.querySelector('.sidebar')
    const blurDiv = document.querySelector('.blur');
    menuBtn.addEventListener('click', e => menuHandler(e));
    window.addEventListener('resize', menuOnResize);

    document.addEventListener('click', e => closeMenu(e));
    document.addEventListener("keydown", e => closeMenu(e));

    function closeMenu(e){
        if(menu.getAttribute('isopen') == 'false') return;

        if(e.target == blurDiv || e.key === "Escape"){
            menuHandler();
        }
    }

    function menuHandler(e){       
        menu.style.transition = 'transform var(--ease-transition)';
        menuContent.style.transition = 'opacity var(--ease-transition)';
        if(menu.getAttribute('isopen') == 'true'){
            var sidebarWidth = sidebar.offsetWidth;
            enableScrolling();
            menu.setAttribute("isopen", false);
            blurDiv.style.display = 'none';

            if(window.matchMedia('(min-width: 992px)').matches){
                menu.style.transform = `translateX(calc(-${menu.offsetWidth}px + ${sidebar.offsetWidth}px))`;
                menuBtn.style.borderLeft = 'none';
            }else{
                setTimeout(() => {
                   menuContent.style.display = 'none';
                }, 300);
                menuContent.style.opacity = '0';
            }
            

            menuBtn.querySelector('.first-line').style.position = 'static';
            menuBtn.querySelector('.first-line').style.transform = 'rotateZ(0deg)';
            menuBtn.querySelector('.second-line').style.position = 'static';
            menuBtn.querySelector('.second-line').style.transform = 'rotateZ(0deg)';
            menuBtn.querySelector('.mobile-line').style.opacity = '1';

            if(sidebar){
                sidebar.style.borderLeft = 'none';
            }     
        }else{

            //Close custom search if opened
            var customSearch = document.querySelector('.custom-search');
            if(customSearch && customSearch.getAttribute('isopen') == "true"){
                document.querySelector('custom-header').closeSearchHandler();
            }

            disableScrolling();
            menu.setAttribute("isopen", true);
            blurDiv.style.display = 'block';
            
            if(window.matchMedia('(min-width: 992px)').matches){
                menu.style.transform = 'translateX(0vw)';
                menuBtn.style.borderLeft = '1px solid var(--text-color)';
            }else{
                menuContent.style.display = 'flex';
                setTimeout(() => {
                    menuContent.style.opacity = '1';
                }, 10);
            }

            menuBtn.querySelector('.first-line').style.position = 'absolute';
            menuBtn.querySelector('.first-line').style.transform = 'rotateZ(-45deg)';
            menuBtn.querySelector('.second-line').style.position = 'absolute';
            menuBtn.querySelector('.second-line').style.transform = 'rotateZ(45deg)';
            menuBtn.querySelector('.mobile-line').style.opacity = '0';

            if(sidebar){
                sidebar.style.borderLeft = '1px solid var(--text-color)';
            }
        }     
    }

    function menuOnResize(){
        //Close custom search if opened
       /*  var customSearch = document.querySelector('.custom-search');
        if(customSearch && customSearch.getAttribute('isopen') == "true"){
            document.querySelector('custom-header').closeSearchHandler();
        } */

        menu.style.transition = 'none';
        menuContent.style.transition = 'none';
        if(menu.getAttribute('isopen') == 'true'){
            menu.style.transform = 'translateX(0vw)';
            menuContent.style.display = 'flex';
            menuContent.style.opacity = '1';
            menuBtn.style.borderLeft = '1px solid var(--text-color)';

        }else{
            var sidebarWidth = sidebar.offsetWidth;
            
            if(window.matchMedia('(max-width: 991px)').matches){
                menuContent.style.display = 'none';
                menuContent.style.opacity = '0';
                menu.style.transform = 'translateX(0vw)';
            }else{
                window.matchMedia('(min-width: 1439px)').matches ? menu.style.transform = `translateX(calc((-29vw + 5vw) * var(--scale)))` :  menu.style.transform = `translateX(calc(-410px * var(--scale) + 72px))`; 
                menuContent.style.display = 'flex';
                menuContent.style.opacity = '1';
                menuBtn.style.borderLeft = 'none';
            }
            
        }
    }  
}

function copyUrlToClipboard(parentElement){
    let parent = document.querySelector(`.${parentElement}`)
    let alert = parent.querySelector('.clipboard-alert');

    parent.querySelector('.clipboard-link').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert.style.display = "block";

        setTimeout(function () {
            alert.style.display = "none";
        }, 3000);
    })
}

function setToggle() {
    const toggleHeadingElements = document.getElementsByClassName("kg-toggle-heading");

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", "0 0 30 18");
    svgElement.setAttribute("fill", "none");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M30 3L15 18L-6.55671e-07 3L2.6625 0.337501L15 12.675L27.3375 0.3375L30 3Z");

    svgElement.appendChild(pathElement);

    document.querySelectorAll('.kg-toggle-card').forEach(card => {
        card.querySelector('.kg-toggle-heading svg').remove();

        const container = card.querySelector(".kg-toggle-card-icon");
        const clonedSvg = svgElement.cloneNode(true);

        container.appendChild(clonedSvg);
    })
    
    const toggleFn = function(event) {
        
        const targetElement = event.target;
        const parentElement = targetElement.closest('.kg-toggle-card');
        var toggleState = parentElement.getAttribute("data-kg-toggle-state");
        if (toggleState === 'close') {
            parentElement.setAttribute('data-kg-toggle-state', 'open');
        } else {
            parentElement.setAttribute('data-kg-toggle-state', 'close');
        }
    };

    for (let i = 0; i < toggleHeadingElements.length; i++) {
        toggleHeadingElements[i].addEventListener('click', toggleFn, false);
    }
}

function setAccountText(){
    let account = document.querySelector('#account-data');
    document.querySelector('.account .heading-1-wrapper h1').innerHTML = account.getAttribute('data-name');
    document.querySelector('.account .hero-description-wrapper p').innerHTML = account.getAttribute('data-description');
}

function findSrcSet(imageUrl, width){
    let splitString = 'images/';
    let insertString = `size/w${width}/`;

    let splitted = imageUrl.split(splitString);
    let modifiedUrl = splitted[0] + splitString + insertString + splitted[1];

    return modifiedUrl;
}

const calcHeightContainers = ["featured-stories-slider", "latest-stories-grid", "authors-grid", "tag-stories-grid"]

window.addEventListener('load', function() {
    calculateTextHeight(calcHeightContainers)
})
window.addEventListener('resize', debounce(() => {calculateTextHeight(calcHeightContainers)}, 200)) 

/* This function calculates the paragraph height and sets the highest one to all. Makes content align */
function calculateTextHeight(containers){
    if(!containers) return;

    containers.forEach(container => {
        containerItem = document.querySelector(`#${container}`);
        if(!containerItem) return;

        var items = containerItem.querySelectorAll('.card-lower-part');
        if(items.length == 0) return;

        var startHeights = [];

        items.forEach(item => {
            item.style.minHeight = "auto";
        })

        if(window.matchMedia('(min-width: 480px)').matches || container == "featured-stories-slider"){
            items.forEach(item => {
                startHeights.push(item.offsetHeight)
            })
    
            var filteredHeights = startHeights.filter((value) => typeof value === "number" && !isNaN(value));
            var highest =  Math.max(...filteredHeights);
    
            items.forEach(item => {
                item.style.minHeight = `${highest}px`;
            })
        }
    })
}

function setDemoColorSchemes(){
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    var paramValue = searchParams.get('color-scheme');
    var storage = localStorage.getItem('color-scheme')

    if(paramValue || storage){

        if(!paramValue){
            paramValue = storage;
        }

        localStorage.setItem('color-scheme', paramValue);

        var root = document.documentElement;

        switch (paramValue) {
            case "dark":
                root.style.cssText = `
                    --background-color: #080808;
                    --text-color: #ffffff;
                    --text-60-opac: #9c9c9c;
                    --text-color-lower-opac: #6b6b6b;
                    --placeholder-color: #393939;
                `
                break;

            case "elegant":
                root.style.cssText = `
                    --background-color: #F2F1EF;
                    --text-color: #472419;
                    --text-60-opac: #8c766f;
                    --text-color-lower-opac: #ad9f99;
                    --placeholder-color: #e1ddda;
                `
                break;
        
            default:
                root.style.cssText = `
                    --background-color: #ffffff;
                    --text-color: #1b1b1b;
                    --text-60-opac: #767676;
                    --text-color-lower-opac: #a4a4a4;
                    --placeholder-color: #f5f5f5;
                `
                break;
        }
    }
}



  