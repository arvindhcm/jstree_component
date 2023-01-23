
let data = { name: "Root", children: [ { name: "Cars", children: [ { name: "Ferrari", children: [ { name: "red", children: [ { name: "Roma", }, { name: "Italia", } ] }, { name: "yellow", } ] }, { name: "Mclaren", children: [ { name: "mL1", }, { name: "mL2", } ] }, { name: "Mazda", children: [ { name: "mx1", }, { name: "mx5", } ] }, ] }, { name: "Bikes", children: [ { name: "Kawasaki", children: [ { name: "ninja600", }, { name: "ninja1000", children : [ { name:'type_first' }, { name:'type_second' } ] } ] }, { name: "Ducati", children: [ { name: "D1", }, { name: "D2", } ] } ] } ] };


let tree = document.getElementById("tree");
let searchField =  document.getElementById("searchField");

 
(function() { 
    
    jsTree.init(data, tree, searchField);

})();
