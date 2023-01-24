
let data = { name: "Root", children: [{ name: "Cars", children: [{ name: "Ferrari", children: [{ name: "red", children: [{ name: "Roma", }, { name: "Italia", }] }, { name: "yellow", }] }, { name: "Mclaren", children: [{ name: "mL1", }, { name: "mL2", }] }, { name: "Mazda", children: [{ name: "mx1", }, { name: "mx5", }] },] }, { name: "Bikes", children: [{ name: "Kawasaki", children: [{ name: "ninja600", }, { name: "ninja1000", children: [{ name: 'type_first' }, { name: 'type_second' }] }] }, { name: "Ducati", children: [{ name: "D1", }, { name: "D2", }] }] }] };
let data2 = { name: "Root", children: [ { name: "apple", children: [ { name: "macbook", children: [ { name: "red", children: [ { name: "m1", }, { name: "m2", } ] }, { name: "mac mini", } ] }, ] }] };


var tree1;
var tree2;


(function () {

    let tree = document.getElementById("tree");
    let searchField = document.getElementById("searchField");
    tree1 = jsTree();
    tree1.init(data, tree, searchField);
    tree1.getUpdatedDataFromDOM()


    //SECOND TREE
    // tree2 = jsTree();
    // let tree2Dom = document.getElementById("tree2");
    // let searchField2 = document.getElementById("searchField2");

    // tree2.init(data2, tree2Dom, searchField2);


})();
