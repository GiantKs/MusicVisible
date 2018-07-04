

var arr=[{a:1,b:0.375,c:0.8},{a:1,b:0.75,c:0.8},{a:1,b:0.66,c:0.5}];

var allB=0;
var allBN=0
arr.forEach((item,index)=>{
    allB+=item.b
    allBN=index+1
})



function mainParticipation(MainData) {
    var correct=0,correctNumber = 0,allParticipation=0,allParticipationNumber=0;
    MainData.forEach((item,index)=>{
        allParticipation+=item.c;allParticipationNumber=index+1;
        correct+=item.b*item.c;
        correctNumber=index+1
    });
    return {
        line:[{q:correct/correctNumber},{w:1-(correct/correctNumber)-(1-(allParticipation/allParticipationNumber))},{e:1-(allParticipation/allParticipationNumber)}]
    }
}

console.log(mainParticipation(arr));




