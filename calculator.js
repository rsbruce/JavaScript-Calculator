function r(arg){
    let numRegex = /\d/
    let opRegex = /[+\-*/^.]/
    let disp = document.getElementById("display").innerHTML;
    if(arg>0 && arg<10){
        disp += arg.toString(10)
    } else if (arg == 'AC'){
        disp = ''
    } else if (arg == 'C'){
        disp = disp.slice(0, disp.length - 1 );
    } 
    
    if(arg == 0 && !(disp.length == 1 && disp[0] == "0")){
        disp += arg.toString()
    }

    if(arg == "/" || arg == "*" || arg == "^"|| arg == "+"){
        if(numRegex.test(disp[disp.length - 1])){
            disp += arg
        }
    }
    
    if(arg == "-"){
        if(disp[disp.length - 1] != "." && disp[disp.length - 1] != "-"){
            disp += arg
        }
    }

    if(arg == "." && !opRegex.test(disp[disp.length - 1])){
        //if the last thing wasn't an operation or dot
        disp = disp.split('').reverse().join('')
        //if we see an operation before a dot append dot
        let dotIndex = disp.indexOf(".")
        let opIndex = - 1
        for(let i=0; i<disp.length; i++){
            if(/[+\-*/^]/.test(disp[i])){
                opIndex = i;
                break;
            }
        }
        disp = disp.split('').reverse().join('')
        if(dotIndex == -1){dotIndex = disp.length}
        if(opIndex == -1) {opIndex = disp.length}
        if(dotIndex>=opIndex){
            
            disp += "."
        }
    }
    document.getElementById("display").innerHTML = disp
    
} 

function compute(){
    let disp = document.getElementById("display").innerHTML.split('')
    if(!/[+\-*/^.]/.test(disp[disp.length -1]) && !(/\//.test(disp[disp.length -2])&&/0/.test(disp[disp.length -1]))){
        //Will not compute if expression ends in operator or if there is an attempt to divide by 0
            for(let i=0; i<disp.length; i++){
            if(disp[i] == "-" && /[*\-+/]/.test(disp[i-1])){
                disp[i] = "a"
            }
        }
        //catch "-" after another operation to allow for negative numbers

        let opArr = disp.filter((e) => /[*\-+/^]/.test(e))
        //make array of all operations in the expression to be computed

        disp = disp.join('')
        let numArr = disp.split(/[*\-+/^]/)
        for(let i=0; i<numArr.length; i++){
            if (numArr[i][0] == "a"){
                numArr[i] = numArr[i].split('')
                numArr[i][0]="-"
                numArr[i] = numArr[i].join('')
            }
            numArr[i] = parseFloat(numArr[i],10)
        }
        //make array of all numbers in the expression to be computed

        
        var precedence = {
            "^": 0,
            "/": 1,
            "*": 2,
            "+": 3,
            "-": 4
        };
        //order of operations
        let sequence = []
        for(let i=0; i<opArr.length; i++){
            sequence[i] = [opArr[i]]
            sequence[i].push(i)            
        }
        //generate 2D array
        //Each item contains an operation at index0 and 
        //the index of the number it follows (acts on) in the original expression at index1
        sequence.sort((a,b) => precedence[(a[0])] - precedence[(b[0])])
        //Sort the items in sequence based on the order of operations given by the var precedence
        
        let temp = []
        let count
        for(let i=0; i<sequence.length; i++){
            count=0;
            for(let j=0; j<i; j++){
                if(sequence[i][1]>sequence[j][1]){
                    count++
                }
            }
            temp[i] = sequence[i].slice()
            temp[i][1] -= count
        }
        //In the computation, when an operation is carried out, between elements i and i+1,
        //the result is assigned to i's location, and the element at i+1 is spliced out,
        //thus decrementing the index of all numbers which follow
        //Sequence consists of elements which themselves are an operation, and the index of the number that they act on
        //As tht index will decrement, the above for loop updates all sequence[x][1] (index of the number that they act on)
        //to reflect what the index will be at the time that operation is carried out
        

        for(let i=0; i<temp.length; i++){
            if(temp[i][0] == "^"){
                numArr[temp[i][1]] = Math.pow(numArr[temp[i][1]], numArr[temp[i][1]+1])
            } else if(temp[i][0] == "/"){
                numArr[temp[i][1]] = numArr[temp[i][1]] / numArr[temp[i][1]+1]
            } else if(temp[i][0] == "*"){
                numArr[temp[i][1]] = numArr[temp[i][1]] * numArr[temp[i][1]+1]
            } else if(temp[i][0] == "+"){
                numArr[temp[i][1]] = numArr[temp[i][1]] + numArr[temp[i][1]+1]
            } else if(temp[i][0] == "-"){
                numArr[temp[i][1]] = numArr[temp[i][1]] - numArr[temp[i][1]+1]
            }
            numArr.splice([temp[i][1]+1],1)
        }
        //the actual computation
        document.getElementById("display").innerHTML = numArr[0]
        //last element in numArr will be the final answer which we assign to the HTML of the display
    }   
}

   
