document.addEventListener('DOMContentLoaded', function(){
  
  //Get hjlaparlinur
  const hjalparlinur = document.getElementById("hjalparlinur"); 
  

  async function detectWindows() {
    const text = document.getElementById('note');
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        // Modern approach
        const uaData = await navigator.userAgentData.getHighEntropyValues(['platform']);
        if (uaData.platform.toLowerCase().includes('windows')) {
              text.classList.add('windows-os');
              hjalparlinur.classList.add('lines-windows-os');
              console.log("windows");
        }
    } else{
        // Fallback for older browsers
        if (navigator.userAgent.toLowerCase().includes('windows')) {
            text.classList.add('windows-os');
            hjalparlinur.classList.add('lines-windows-os');
            console.log("windows");
        }
    }
  }

  // Call the function
  detectWindows();

  // Setja inn texta
  function addText() {
      const entryInput = document.getElementById('input-text-area');
      //athuga ef einhver texti hefur verið skrifaður
      if (entryInput.value) {
        const note = document.getElementById('note');
        if (!note) return; 
        note.textContent = entryInput.value.replace(/\r?\n/g, " \n");
        entryInput.value = '';
        entryInput.setAttribute('placeholder', 'Viltu bæta við texta?');

      } else entryInput.setAttribute('placeholder', 'Ekkert hefur verið slegið inn');

    }; //addText()
    const btnAddText = document.getElementById("btnAddText");
    if(btnAddText){
      btnAddText.addEventListener("click", addText);
    }
    

    
    //Function to clear all the notes already added to the page - when note was a class
    function clearText() {
      document.querySelectorAll('.note').forEach((note) => {
        note.remove();
      })
    }


    function windowPrint(){
      window.print();
    }
    const btnWindowPrint = document.getElementById("btnWindowPrint");
    if(btnWindowPrint){
      btnWindowPrint.addEventListener("click", windowPrint);
    }
   
    


    
    //function to add lines
    function createHjalparlinur(){
      if (!hjalparlinur) return;
  
      const div = document.createElement('div');

      const yfirlina = document.createElement('span');
      yfirlina.classList.add('yfirlina');

      const midlina = document.createElement('span');
      midlina.classList.add('midlina');

      const grunnlina = document.createElement('span');
      grunnlina.classList.add('grunnlina');
      
      const undirlina = document.createElement('span');
      undirlina.classList.add('undirlina');

      div.append(yfirlina, midlina, grunnlina, undirlina);
      hjalparlinur.appendChild(div)

    }
  
    for (var i = 0; i < 14; i++) {
      createHjalparlinur();
    }




    const note = document.getElementById('note');
    const fontSize = window.getComputedStyle(note, null).getPropertyValue('font-size');

    // FITLERS

    // Typeface
    if (document.getElementById('filter-krokar').checked == true){
      note.classList.add("font-krokar");
      const typeRadio = document.querySelectorAll('input[name="typeface"]');
      for (let i = 0; i < typeRadio.length; i++) {
        typeRadio[i].addEventListener("change", function(){
        if(this.value == "SkriftisTengd"){
          note.classList.add("font-tengd");
          note.classList.remove("font-krokar", "font-penna");
        }
        if(this.value == "SkriftisPenna"){
          note.classList.add("font-penna");
          note.classList.remove("font-krokar", "font-tengd");
        }
        if(this.value == "SkriftisKrokar"){
          note.classList.add("font-krokar");
          note.classList.remove("font-tengd", "font-penna");
        }
        })
      }
    }

    // Font-size
    if (document.getElementById('filter-large').checked == true){
      note.classList.add("fs-large");
      const sizeRadio = document.querySelectorAll('input[name="type-size"]');
      const hjalparlinur = document.getElementById('hjalparlinur').children;

      for (var i = 0; i < hjalparlinur.length; i++) {
        hjalparlinur[i].classList.add('hl-large');
      }
      
      for (let i = 0; i < sizeRadio.length; i++) {
        sizeRadio[i].addEventListener("change", function(){
          if(this.value == "medium"){
            note.classList.add("fs-medium");
            note.classList.remove("fs-small", "fs-large");
            for (var i = 0; i < hjalparlinur.length; i++) {
              hjalparlinur[i].classList.add('hl-medium');
              hjalparlinur[i].classList.remove('hl-small', 'hl-large');
            }           
          }
          if(this.value == "small"){
            note.classList.add("fs-small");
            note.classList.remove("fs-medium", "fs-large");
            for (var i = 0; i < hjalparlinur.length; i++) {
              hjalparlinur[i].classList.add('hl-small');
              hjalparlinur[i].classList.remove('hl-medium', 'hl-large');
            }            
          }
          if(this.value == "large"){
            note.classList.add("fs-large");
            note.classList.remove("fs-medium", "fs-small");
            for (var i = 0; i < hjalparlinur.length; i++) {
              hjalparlinur[i].classList.add('hl-large');
              hjalparlinur[i].classList.remove('hl-small', 'hl-medium');
              }
          }
        })
      }
    }

    // Forskrift / Sporun
    if (document.getElementById('filter-forskrift').checked == true){
      note.classList.add("filter-forskrift");
      const typeRadio = document.querySelectorAll('input[name="filter-skrift-sporun"]');
      for (let i = 0; i < typeRadio.length; i++) {
        typeRadio[i].addEventListener("change", function(){
        if(this.value == "filter-forskrift"){
          note.classList.add("filter-forskrift");
          note.classList.remove("filter-sporun");
        }
        if(this.value == "filter-sporun"){
          note.classList.add("filter-sporun");
          note.classList.remove("filter-forskrift");
        }
        })
      }
    }

    // Left or Right
    if (document.getElementById('filter-align-left').checked == true){
      note.classList.add("text-align-left");
      const typeRadio = document.querySelectorAll('input[name="text-align"]');
      for (let i = 0; i < typeRadio.length; i++) {
        typeRadio[i].addEventListener("change", function(){
        if(this.value == "text-align-left"){
          note.classList.add("text-align-left");
          note.classList.remove("text-align-right");
        }
        if(this.value == "text-align-right"){
          note.classList.add("text-align-right");
          note.classList.remove("text-align-left");
        }
        })
      }
    }

    // Fela línur
    const checkboxHjalparlinur = document.getElementById('filter-hjalparlinur');
    
    checkboxHjalparlinur.addEventListener('change', (e) => {
      const arrHjalparlinur = document.querySelectorAll('.yfirlina, .undirlina');
      if(e.target.checked){
        for (let i= 0; i< arrHjalparlinur.length; i++){
          arrHjalparlinur[i].style.display = 'none';
        }
      }else{
        for (let i= 0; i< arrHjalparlinur.length; i++){
          arrHjalparlinur[i].style.display = 'inline-block';
        }
      }
    });

    //Miðlína
    const checkboxMidlina = document.getElementById('filter-midlina');
    checkboxMidlina.addEventListener('change', (e) => {
      const arrMidlina = document.querySelectorAll('.midlina');
      if(e.target.checked){
        for (let i= 0; i< arrMidlina.length; i++){
          arrMidlina[i].style.display = 'none';
        }
      }else{
        for (let i= 0; i< arrMidlina.length; i++){
          arrMidlina[i].style.display = 'inline-block';
        }
      }
    })
  


  function showPracticeIdeas(){
    const modal = document.getElementById("modalPracticeIdeas");
    if(modal){
      modal.classList.add("showModalPI");
      const btnCloseModalPI = document.createElement("div");
      btnCloseModalPI.id = ("btnCloseModalPI");
      btnCloseModalPI.innerHTML= '<i class="bi bi-x"></i>';
      
      const innerModal = document.getElementById("innerModalContainer");
      innerModal.prepend(btnCloseModalPI);
      innerModal.classList.add("showInnerModalPI");
      function closePracticeIdeas(){
        modal.classList.remove("showModalPI");
        btnCloseModalPI.remove();

      }
      btnCloseModalPI.addEventListener("click", closePracticeIdeas);
    }
  }

  const btnModal = document.getElementById("btnPracticeIdeas");
  if(btnModal){
    btnModal.addEventListener("click", showPracticeIdeas);
  }


  
}); 
