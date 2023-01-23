let data = { name: "Root", children: [ { name: "Cars", children: [ { name: "Ferrari", children: [ { name: "red", children: [ { name: "fr Roma", }, { name: "fr Italia", } ] }, { name: "yellow", } ] }, { name: "Mclaren", children: [ { name: "mL1", }, { name: "mL2", } ] }, { name: "Mazda", children: [ { name: "mx1", }, { name: "mx5", } ] }, ] }, { name: "Bikes", children: [ { name: "Kawasaki", children: [ { name: "ninja600", }, { name: "ninja1000", children : [ { name:'type_first' }, { name:'type_second' } ] } ] }, { name: "Ducati", children: [ { name: "D1", }, { name: "D2", } ] } ] } ] };
let deselectionInProgress = false;

let fa_edit =  document.querySelector("template.btn-edit").content.cloneNode(true);
let fa_delete =  document.querySelector("template.btn-delete").content.cloneNode(true);
let fa_save =  document.querySelector("template.btn-save").content.cloneNode(true);

 getSelectableNode = (child) => {

    
    let li = document.createElement("li");

    let label = document.createElement("label");
    li.setAttribute("name",child.name);

    label.textContent = child.name;
    li.appendChild(label);

     let checkbox = document.createElement("input");
     checkbox.setAttribute("type","checkbox");
     checkbox.setAttribute("name",child.name);
     checkbox.setAttribute("value", child.name);
     checkbox.addEventListener("change", handleSelection);

     let editButton = document.createElement("button");
     editButton.textContent = "Edit";
     editButton.setAttribute("btn-type","edit")
     editButton.addEventListener("click", handleEdit);
    //  let fa_edit=  document.querySelector("template.btn-edit").content.cloneNode(true);
    //  editButton.appendChild(fa_edit);

     li.appendChild(editButton);

     let deleteButton = document.createElement("button");
     deleteButton.textContent = "Delete";
     deleteButton.setAttribute("btn-type","delete")
     deleteButton.addEventListener("click", handleDelete);
     
    //  let fa_delete =  document.querySelector("template.btn-delete").content.cloneNode(true);
    //  deleteButton.appendChild(fa_delete);

     li.appendChild(deleteButton);

     li.insertBefore(checkbox, li.firstChild);

     let dropdownArrow = document.createElement("i");
     dropdownArrow.classList.add("fa-regular","fa-square-caret-down");
     dropdownArrow.addEventListener("click", handleCollapse)

     li.insertBefore(checkbox, li.firstChild);
     li.insertBefore(dropdownArrow, li.firstChild);

     li.setAttribute("draggable", "true");
     li.addEventListener("dragstart", handleDragStart);
     li.addEventListener("dragover", handleDragOver);
     li.addEventListener("drop", handleDrop);

     return li

}

function handleCollapse(e) {
    let li = e.target.parentNode;
    let ul = li.querySelector("ul");
    if (ul) {
        ul.classList.toggle("collapsed");
    }
}

function selecAllChild(ul){
    for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].querySelector("input[type=checkbox]").checked = true;
        let childUl =  ul.children[i].querySelector("ul")
        if(childUl){
            selecAllChild(childUl)
        }
    }
}

function deselecAllChild(ul){
    for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].querySelector("input[type=checkbox]").checked = false;
        let childUl =  ul.children[i].querySelector("ul")
        if(childUl){
            deselecAllChild(childUl)
        }
    }
}

function handleSelection(e) {
    let checkbox = e.target;
    let li = checkbox.parentNode;
    let ul = li.parentNode;
    let parentCheckbox = (ul.parentNode).querySelector("input[type=checkbox]");
    let childUl = li.querySelector("ul");

    if (checkbox.checked) {
        let allChildrenChecked = true;
        for (let i = 0; i < ul.children.length; i++) {
            if (!ul.children[i].querySelector("input[type=checkbox]").checked) {
                allChildrenChecked = false;
                break;
            }
        }

        if(childUl){
            selecAllChild(childUl);
        }

        if (allChildrenChecked && parentCheckbox) {
            parentCheckbox.checked = true;
             handleSelection({ target: parentCheckbox });
        }
    } else {
        if (!deselectionInProgress && parentCheckbox) {
            deselectionInProgress = true;
            parentCheckbox.checked = false;

            if(childUl){
                deselecAllChild(childUl);
            }
            handleSelection({ target: parentCheckbox });
            deselectionInProgress = false;
        }
    }

}


function buildTree(node, tree) {
    let ul = document.createElement("ul");

    node.children.forEach(function(child) {
      
        li = getSelectableNode(child);

        ul.appendChild(li);

        if(!child.children){
            li.setAttribute("data-leaf","true")
        }

        if (child.children) {
            buildTree(child, li);
        }

    });

    tree.appendChild(ul);
}

let tree = document.getElementById("tree");
let searchField =  document.getElementById("searchField");
buildTree(data, tree);


function showNodeWithParent(node){
    node.style.display = "block";

    let closestParentLi = node.parentNode.closest("li");
    if(closestParentLi){
        showNodeWithParent(closestParentLi);
    }
}

function handleEdit(e) {

    let button = e.target;
    let li = button.parentNode;
    
    if(button.textContent == "Save"){
        let editableField = li.querySelector("input[type='text']");
        handleSave({target:editableField});
        return
    }

    let label = li.querySelector("label");
    let input = document.createElement("input");
    input.setAttribute("type","text");
    input.value = label.textContent;
    input.addEventListener("blur", handleSave);
    


    li.replaceChild(input, label);

    button.textContent = "Save"; 
    // button.appendChild(fa_save)
}

function handleSave(e) {
    let input = e.target;
    let li = input.parentNode;
    li.querySelector("button[btn-type='edit']").textContent = "Edit";
    // li.querySelector("button[btn-type='edit']").appendChild(fa_edit);

    let label = document.createElement("label");
    label.textContent = input.value;
    li.replaceChild(label, input);
}

function handleDelete(e) {
    let button = e.target;
    let li = button.parentNode;
    let ul = li.parentNode;
    ul.removeChild(li);
}
function handleDrop(e) {
    e.preventDefault();
    let targetLi = e.target;
    while (targetLi.tagName !== "LI") {
        targetLi = targetLi.parentNode;
    }
    let sourceLi = document.querySelector("[dragging=true]");
    if (targetLi.parentNode !== sourceLi.parentNode) {
        sourceLi.removeAttribute("dragging");
        return;
    }
    let sourceParent = sourceLi.parentNode;
    let targetParent = targetLi.parentNode;
    let sourceIndex = Array.prototype.indexOf.call(sourceParent.children, sourceLi);
    let targetIndex = Array.prototype.indexOf.call(targetParent.children, targetLi);
    if (sourceIndex < targetIndex) {
        targetParent.insertBefore(sourceLi, targetLi.nextSibling);
    } else {
        targetParent.insertBefore(sourceLi, targetLi);
    }
    sourceLi.removeAttribute("dragging");
}
function handleDragStart(e) {
    let li = e.target;
    li.setAttribute("dragging","true");
    e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}
searchField.oninput = function({target}) {
    let searchTerm = (target.value);

   
    let matchedNodes = document.querySelectorAll(`#tree li[name*='${searchTerm}']`);   /**  optimized search */ 
    let unMatchedNodes = document.querySelectorAll(`#tree li:not([name^='${searchTerm}'])`);

    if(!searchTerm){
            document.querySelectorAll(`#tree li`).forEach(el => el.style.display = "block");
            return
    }

    unMatchedNodes.forEach(function(node) { 
        node.style.display = "none";
    });

    matchedNodes.forEach(function(node) {
        showNodeWithParent(node)
    });
    


    // let treeNodes = document.querySelectorAll("#tree li");
    // treeNodes.forEach(function(node) {
    //     if (node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {      /**  unoptimized search */
    //         node.style.display = "block";
    //     } else {
    //         node.style.display = "none";
    //     }
    // });
};

// document.addEventListener("click","i",function(e){
//     e.stopPropagation();
//     e.preventDefault();

//     return false
// })