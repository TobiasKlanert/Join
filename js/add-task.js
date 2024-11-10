let prevElement = null;
let prevClassName;
let isInverted = false;

function changeColors(className, element) {
    if (prevElement != null && prevElement != element && prevElement.classList.contains('is-inverted')) {
        invertColors(prevClassName, prevElement)
    }
    invertColors(className, element)
    prevElement = element;
    prevClassName = className;
    isInverted = !isInverted
}

function invertColors(className, element) {
    element.classList.toggle('is-inverted')
    let svg = document.querySelector(className);
    let fillColor = window.getComputedStyle(svg, null).getPropertyValue("fill")
    console.log(fillColor);
    element.style.backgroundColor = fillColor
    let svgPaths = document.querySelectorAll(className);
    svgPaths.forEach(e => {
        e.classList.toggle('fill-color-white')
    });
    
    element.classList.toggle('color-white')
    console.log(element);
}

