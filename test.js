// set1 = new Set([1,2,3, 4]);
// set2 = new Set([1,2,3,4, 5]);



// function setsAMinusB(a, b) {
//     result = new Set();
//     a.forEach(el => {
//         if(!b.has(el)) {
//                     result.add(el);
//                 }
//     });
//     // a.forEach((el) => {
//     //     if(!b.has(a)) {
//     //         result.add(el);
//     //     }
//     // });
//     return result;
// }

// console.log(setsAMinusB(set2, set1));

// // function setsAreEqual(a, b) {
// //     if (a.size !== b.size) {
// //         return false;
// //       }
    
// //       return Array.from(a).every(element => {
// //         return b.has(element);
// //       });
// // }

// // function changeSet1() {
// //     set2 = new Set([1,2,3, 5]);
// //     console.log(setsAreEqual(set1, set2));
// //     set1 = set2;
// //     console.log(setsAreEqual(set1, set2));
// // }


// // changeSet1();



// // set1.forEach(el => {
// //     console.log(el);
// // })
// // const puppeteer = require('puppeteer');

// // 

function validLineNum(line_num) {
    return ['A', 'C', 'E', 'B', 'D', 'F', 'M', 'G', 'J', 'Z', 'N', 'Q', 'R', 'W', 'L', 
            '1', '2', '3', '4', '5', '6', '7', 'SI'].indexOf(line_num) >= 0;
}

console.log(validLineNum('banana'));