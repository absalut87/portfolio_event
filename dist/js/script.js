const hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu'),
    closeElem = document.querySelector('.menu__close');

hamburger.addEventListener('click', () => {
    menu.classList.add('active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('active');
});

const counters = document.querySelectorAll('.skills__percents-item-count'),
    lines = document.querySelectorAll('.skills__percents-item-scale span');

console.log(counters);
console.log(lines);

counters.forEach((item, i) => {
    lines[i].style.width = item.innerHTML;
});