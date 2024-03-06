'use strict';
// Модальное окно 

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn=>btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//скролл
btnScrollTo.addEventListener('click',function(){
  section1.scrollIntoView({behavior:'smooth'})
})

// вклыдки
tabsContainer.addEventListener('click', (e)=>{
  const clicked = e.target.closest('.operations__tab' ); 
  console.log(clicked )
  tabs.forEach(t=>t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t=>t.classList.remove('operations__content--active'))
  if(clicked){
    clicked.classList.add('operations__tab--active')
  }

  //активация контента
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
  
})

// анимация меню
const handleHover = function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img'); 
     
    siblings.forEach(el => {
      if(el !== link){
        el.style.opacity = opacity;
      }
    })
    logo.style.opacity = opacity;
  }
}

nav.addEventListener('mouseover', function(e){
  handleHover(e,0.5)
})

nav.addEventListener('mouseout', function(e){
  handleHover(e,1)
})

// липкая навигация
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const[entry] = entries; // тоже самое, что и entries[0]
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  } else{
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav,{
  root:null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})
headerObserver.observe(header)


// раскрывание секций
const allSections = document.querySelectorAll('.section')
const revealSection = function(entries,observer){
  const[entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection,{
  root:null,
  threshold: 0.15
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})

// загрузка изображения
const imgTargets = document.querySelectorAll('img[data-src');
const loadImg = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  //заменяем src на data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve (entry.target);
}

const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold: 0
})

imgTargets.forEach(img=> imgObserver.observe(img));


//слайдер
const slider = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots')

let curSlide = 0;
const maxSlide = slider.length;

// слайдер точки
const createDots = function(){
  slider.forEach(function(el,i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class='dots__dot' data-slide='${i}'></button>`)
  })
}
createDots()


const activeteDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activeteDot(0)

// slider.forEach((el,index)=>{
//   el.style.transform =`translateX(${100 * index}%)`
// })

const goToSlide = function(slide){
  slider.forEach((el,index)=>{
    el.style.transform =`translateX(${100 * (index-slide)}%)`
  })
}
goToSlide(0);

const nextSlide = function(){
  if(curSlide === maxSlide-1){
    curSlide = 0;
  }else{
    curSlide++;
  }
  goToSlide(curSlide)
  activeteDot(curSlide)
}

const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide - 1;
  }else{
    curSlide--;
  }
  goToSlide(curSlide)
  activeteDot(curSlide)
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// переключать клавишами
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  if(e.key === 'ArrowRight') nextSlide()
})

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide
    goToSlide(slide)
    activeteDot(slide)
  }
})
