document.addEventListener("DOMContentLoaded", function() { 

    // Skólastig MEMM - Taxonomy
    const arraySkolastig = document.getElementsByClassName("taxonomy-skolastig");
    for (var i = 0; i < arraySkolastig.length; i++){

        //Get all children and filter out <span> elements, keeping only <a> elements
        const aElements = Array.from(arraySkolastig[i].children).filter(child => child.tagName === 'A');
        console.log(aElements)
        for (var i = 0; i < aElements.length; i++){
            //Remove links
            aElements[i].removeAttribute('href');
            
            // Styles
            Object.assign(aElements[i].style, {
                backgroundColor: "var(--wp--preset--color--himinn-200)",
                color: "var(--wp--preset--color--hafbotn)",
                borderRadius: "6px",
                padding: "10px",
                fontSize: "var(--wp--preset--font-size--sm-p)",
                marginRight: "8px"
            })
        }
    };
});