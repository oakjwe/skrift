document.addEventListener("DOMContentLoaded", function() { 
  
 //  ****  POSTS - CARD ****
      //function for displaying arrow on hover for post cards
        const postCardArray = document.getElementsByClassName("card");
  
        for (var i = 0; i < postCardArray.length; i++){
          const post = postCardArray[i];
  
          // creating elements for the arrow icon
          const arrowDiv  = document.createElement("div");
          const arrowIcon = document.createElement("i");
          arrowDiv.classList.add("btn-card-arrow");
          arrowIcon.classList.add("bi", "bi-arrow-right-short");
          arrowDiv.appendChild(arrowIcon);
          post.prepend(arrowDiv);
          
          // Making the full card clickable
          const postClassList = post.classList;
          const link = post.querySelector('a');
          const aTag = document.createElement("a");
          aTag.classList.add("overlay-link");
          aTag.href = link.href;
          post.appendChild(aTag);
  
          function postMouseOver(){
              postClassList.add("post-focus"); 
          };
          function postMouseOut(){
              postClassList.remove("post-focus");   
          };
  
          post.addEventListener("mouseover", postMouseOver);
          post.addEventListener("mouseout", postMouseOut);
        }
  
//  ****  C-BOX LINK ****
      //function for displaying arrow on hover for post cards
      const cBoxArray = document.getElementsByClassName("c-box-link");
  
      for (var i = 0; i < cBoxArray.length; i++){
        const cbox = cBoxArray[i];

        // creating elements for the arrow icon
        const iconDiv  = document.createElement("div");
        const icon = document.createElement("i");
        iconDiv.classList.add("btn-card-arrow");
        icon.classList.add("bi", "bi-arrow-right-short");
        iconDiv.appendChild(icon);
        const title = cbox.querySelector(".title-cont");
        title.append(iconDiv);

        
        // Making the full card clickable
        const cboxClassList = cbox.classList;
        const link = cbox.querySelector('a');
        if(link != null){
            const aTag = document.createElement("a");
            aTag.classList.add("overlay-link");
            aTag.href = link.href;
            if (link && link.getAttribute('target') === '_blank') {
                aTag.setAttribute('target', '_blank');
                aTag.setAttribute("rel", "noopener noreferrer");
                icon.style.transform = 'rotate(-45deg)';
              } 
            cbox.appendChild(aTag);

            function cboxMouseOver(){
                cboxClassList.add("cbox-focus"); 
            };
            function cboxMouseOut(){
                cboxClassList.remove("cbox-focus");   
            };
    
            cbox.addEventListener("mouseover", cboxMouseOver);
            cbox.addEventListener("mouseout", cboxMouseOut);
        }

      }

  });