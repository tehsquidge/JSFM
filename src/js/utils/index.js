export function combinations(input) {
    const combi = [];
    const letLen = Math.pow(2, input.length);
    
    for (let i = 0; i < letLen ; i++){
        let curCom= [];
        for (let j=0;j<input.length;j++) {
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