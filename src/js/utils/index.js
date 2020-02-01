export function combinations(input) {
    var combi = [];
    var letLen = Math.pow(2, input.length);
    
    for (var i = 0; i < letLen ; i++){
        let curCom= [];
        for (var j=0;j<input.length;j++) {
            if ((i & Math.pow(2,j))){ 
                curCom.push(input[j]);
            }
        }
        if (curCom.length !== "") {
            combi.push(curCom);
        }
    }
    return combi;
}