
// let fa_edit = document.querySelector("template.btn-edit").content.cloneNode(true);
// let fa_delete = document.querySelector("template.btn-delete").content.cloneNode(true);
// let fa_save = document.querySelector("template.btn-save").content.cloneNode(true);

var jsTree = (function () {

    var jsTreeObject = {
        deselectionInProgress : false,

        domSelector:{
            searchField: null
        },

        getSelectableNode: function ({ name }) {

            let nodeName = name;
            let li = document.createElement("li");

            let label = document.createElement("label");
            li.setAttribute("name", nodeName.toLowerCase());

            label.textContent = nodeName;
            li.appendChild(label);

            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", nodeName);
            checkbox.setAttribute("value", nodeName);
            checkbox.addEventListener("change", jsTreeObject.handleSelection);

            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.setAttribute("btn-type", "edit")
            editButton.addEventListener("click", jsTreeObject.handleEdit);
            //  let fa_edit=  document.querySelector("template.btn-edit").content.cloneNode(true);
            //  editButton.appendChild(fa_edit);

            li.appendChild(editButton);

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("btn-type", "delete")
            deleteButton.addEventListener("click", jsTreeObject.handleDelete);

            //  let fa_delete =  document.querySelector("template.btn-delete").content.cloneNode(true);
            //  deleteButton.appendChild(fa_delete);

            li.appendChild(deleteButton);

            // let options = document.createElement("span");
            // options.appendChild(editButton);
            // options.appendChild(deleteButton);
            // li.appendChild(options);


            let dropdownArrow = document.createElement("i");
            dropdownArrow.classList.add("fa-solid", "fa-angle-down");
            dropdownArrow.addEventListener("click", jsTreeObject.handleCollapse)


            let dragHandler = document.createElement("i");
            dragHandler.classList.add("fa-solid", "fa-grip");

            li.insertBefore(checkbox, li.firstChild);
            li.insertBefore(dragHandler, li.firstChild);
            li.insertBefore(dropdownArrow, li.firstChild);


            li.setAttribute("draggable", "true");
            li.addEventListener("dragstart", jsTreeObject.handleDragStart);
            li.addEventListener("dragover", jsTreeObject.handleDragOver);
            li.addEventListener("drop", jsTreeObject.handleDrop);

            li.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation()
                let btns = e.target.querySelectorAll("button[btn-type]");
                btns.forEach((elem, idx) => {
                    if (idx > 1) {
                        return
                    }
                    elem.classList.add("inline-block");
                })
            }, false)

            return li

        },

        handleCollapse: function (e) {
            let li = e.target.parentNode;
            let ul = li.querySelector("ul");
            if (ul) {
                ul.classList.toggle("collapsed");
            }
        },

        selecAllChild: function (ul) {
            for (let i = 0; i < ul.children.length; i++) {
                ul.children[i].querySelector("input[type=checkbox]").checked = true;
                let childUl = ul.children[i].querySelector("ul")
                if (childUl) {
                    jsTreeObject.selecAllChild(childUl)
                }
            }
        },

        deselecAllChild: function (ul) {
            for (let i = 0; i < ul.children.length; i++) {
                ul.children[i].querySelector("input[type=checkbox]").checked = false;
                let childUl = ul.children[i].querySelector("ul")
                if (childUl) {
                    jsTreeObject.deselecAllChild(childUl)
                }
            }
        },

        handleSelection: function (e) {
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

                if (childUl) {
                    jsTreeObject.selecAllChild(childUl);
                }

                if (allChildrenChecked && parentCheckbox) {
                    parentCheckbox.checked = true;
                    jsTreeObject.handleSelection({ target: parentCheckbox });
                }
            } else {
                if (!jsTreeObject.deselectionInProgress && parentCheckbox) {
                    jsTreeObject.deselectionInProgress = true;
                    parentCheckbox.checked = false;

                    if (childUl) {
                        jsTreeObject.deselecAllChild(childUl);
                    }
                    jsTreeObject.handleSelection({ target: parentCheckbox });
                    jsTreeObject.deselectionInProgress = false;
                }
            }

        },


        showNodeWithParent: function (node_one) {
            node_one.style.display = "block";

            let closestParentLi = node_one.parentNode.closest("li");
            if (closestParentLi) {
                jsTreeObject.showNodeWithParent(closestParentLi);
            }
        },

        handleEdit: function (e) {

            let button = e.target;
            let li = button.parentNode;

            if (button.textContent == "Save") {
                let editableField = li.querySelector("input[type='text']");
                handleSave({ target: editableField });
                return
            }

            let label = li.querySelector("label");
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.value = label.textContent;
            input.addEventListener("blur", handleSave);



            li.replaceChild(input, label);

            button.textContent = "Save";
            // button.appendChild(fa_save)
        },

        handleSave: function (e) {
            let input = e.target;
            let li = input.parentNode;
            li.querySelector("button[btn-type='edit']").textContent = "Edit";
            // li.querySelector("button[btn-type='edit']").appendChild(fa_edit);

            let label = document.createElement("label");
            label.textContent = input.value;
            li.replaceChild(label, input);
        },

        handleDelete: function (e) {
            let button = e.target;
            let li = button.parentNode;
            let ul = li.parentNode;
            ul.removeChild(li);
        },


        handleDrop: function (e) {
            e.preventDefault();
            let targetLi = e.target;
            targetLi.setAttribute("dropping", "true");

            while (targetLi.tagName !== "LI") {
                targetLi = targetLi.parentNode;
            }
            let sourceLi = document.querySelector("[dragging=true]");

            if (!sourceLi || targetLi.parentNode !== sourceLi.parentNode) {      // will reorder only between sibling of same parent

                sourceLi && sourceLi.removeAttribute("dragging");
                targetLi && targetLi.removeAttribute("dropping");
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
            sourceLi && sourceLi.removeAttribute("dragging");
            targetLi && targetLi.removeAttribute("dropping");
        },

        handleDragStart: function (e) {
            let li = e.target;
            li.setAttribute("dragging", "true");
            e.dataTransfer.effectAllowed = "copyMove";
        },

        handleDragOver: function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        },
        bindEvent: function () {
            jsTreeObject.domSelector.searchField.oninput = function ({ target }) {
                let searchTerm = (target.value);


                let matchedNodes = document.querySelectorAll(`#tree li[name*='${searchTerm}']`);
                let unMatchedNodes = document.querySelectorAll(`#tree li:not([name^='${searchTerm}'])`);

                if (!searchTerm) {
                    document.querySelectorAll(`#tree li`).forEach(el => el.style.display = "block");
                    return
                }

                unMatchedNodes.forEach(function (node) {
                    node.style.display = "none";
                });

                matchedNodes.forEach(function (node) {
                    jsTreeObject.showNodeWithParent(node)
                });
            }
        },

        buildTree: function (data, tree, searchField) {
            let ul = document.createElement("ul");

            data.children.forEach(function (child) {

                li = jsTreeObject.getSelectableNode(child);

                ul.appendChild(li);

                if (!child.children) {
                    li.setAttribute("data-leaf", "true")
                }

                if (child.children) {
                    jsTreeObject.buildTree(child, li);
                }

            });

            tree.appendChild(ul);

          
        }

    }




    return {
        init: function (data, tree, searchField) {
            jsTreeObject.domSelector.searchField = searchField;
            jsTreeObject.bindEvent();
            return jsTreeObject.buildTree(data, tree, searchField)
        }
    }
})();


