document.addEventListener("DOMContentLoaded", function() { 

  //  ****  BTN HIDE/SHOW  ****
    //function for showing content when clicking on "Lesa meira" btn
    // .btn-more
    const btnReadMoreArray = document.getElementsByClassName("btn-more");

    for (var i = 0; i < btnReadMoreArray.length; i++){
      const btnReadMore = btnReadMoreArray[i];
      const iconSpan = document.createElement("span");
      const iconTag = document.createElement("i");
      iconSpan.classList.add("i-span");
      iconTag.classList.add("bi", "bi-chevron-down");

      iconSpan.appendChild(iconTag);
      btnReadMore.appendChild(iconSpan);

      btnReadMore.addEventListener("click", function(){
        const hidden = btnReadMore.nextElementSibling;
        const hiddenClass = hidden.classList;
        hiddenClass.toggle("show-content");
        iconTag.classList.toggle("rotated");
      });
    }

    //.btn-more-line
    const btnMoreLineArray = document.getElementsByClassName("btn-more-line");

    for (var i = 0; i < btnMoreLineArray.length; i++){
      const btnLine = btnMoreLineArray[i];
      const span = document.createElement("span");
      span.classList.add("span-line");

      btnLine.prepend(span);
  
      btnLine.addEventListener("click", function(){

        const parent = btnLine.parentElement;
        if(!parent) return null;
        const hidden = parent.nextElementSibling;
        const hiddenClass = hidden.classList;
        console.log(hiddenClass)
        if (hiddenClass.contains("hide-content")){
            hiddenClass.toggle("show-content");
          }
        const btnText = document.querySelector(".btn-more-line p");
        if(btnText && btnText.innerHTML.includes("Lesa meira")){
          btnText.innerHTML = "Lesa minna"
        }else if(btnText && btnText.innerHTML.includes("Lesa minna")){
          btnText.innerHTML = "Lesa meira"
        }
      });
    }

  //  ****  List style  ****
  const listStyleLargeCircleArray = document.getElementsByClassName("list-style-large-circle"); 

  for (let i = 0; i < listStyleLargeCircleArray.length; i++) {
    const element = listStyleLargeCircleArray[i];
    const markArray = element.getElementsByTagName("mark");
    const highlight = markArray[0];
    const bgColor = window.getComputedStyle(highlight).backgroundColor;
    const circle = document.createElement("span");
    circle.classList.add("large-circle-bullet");
    circle.style.borderColor = bgColor
    element.prepend(circle);

    
  }




});