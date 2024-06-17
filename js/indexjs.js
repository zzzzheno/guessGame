window.addEventListener("load", (event) => {
    const gameStart = document.querySelector("#gameStart");
    const gameText1 = document.querySelector("#gameText1");
    const gameText2 = document.querySelector("#gameText2");
    const guessForm = document.querySelector("#guessForm");
    const br = document.createElement("br");
    var guessCount = 10;   
    var rate = 0;

    // 該局的猜測紀錄 start
     const guessRecord = {
        rate: [],
        num: [],
        memo: []
     }
    // 該局的猜測紀錄 end

    // 產生隨機數字 start
    const randomNum = Math.floor((Math.random() * 100) + 1);
    console.log(randomNum);
    // 產生隨機數字 end
    
    // 建立輸入數字的input start
    var guessNumInput = document.createElement("input");
    guessNumInput.id = "guessNumInput";
    guessNumInput.type = "number";
    guessNumInput.inputMode = "numeric";
    guessNumInput.placeholder = "猜一個數字！";
    guessNumInput.min = "0";
    guessNumInput.max = "100";
    // 建立輸入數字的input end
  
    // 建立form的送出 start
    var formSubmit = document.createElement("input");
    formSubmit.id = "formSubmit";
    formSubmit.type = "button";
    formSubmit.value = "猜！";
    // 建立form的送出 end

    // 建立“重新開始”按鈕 start
    var replay = document.createElement("input");
    replay.id = "replay";
    replay.type = "button";
    replay.value = "重新開始";
    replay.onclick = function replayGame(){
        guessCount = 10;
        rate = 0;
        guessRecord.rate = [];
        guessRecord.num = [];
        guessRecord.memo = [];
        gameText2.innerText = "剩餘" + guessCount + "次";
        errorMessage.remove();
        successMessage.remove();
        guessNumInput.disabled = false;
        guessNumInput.value = "";
        formSubmit.disabled = false;
        replay.remove();
        guessMemo.innerHTML = "";
    }
    // 建立“重新開始”按鈕 end
    
    // 建立錯誤提示訊息 start
    var errorMessage = document.createElement("div");
    errorMessage.className = "errorMessage";
    // 建立錯誤提示訊息 end
    
    // 建立成功提示訊息 start
    var successMessage = document.createElement("div");
    successMessage.className = "successMessage";
    // 建立成功提示訊息 end

    // 建立猜測紀錄 start
    var guessMemo = document.createElement("div");
    guessMemo.id = "guessMemo";
    // 建立猜測紀錄 end

    // 遊戲開始 start
    gameStart.onclick = function(){
      gameText1.innerText = "從1~100間猜一個數字";
      gameText2.innerText = "剩餘" + guessCount + "次";
      gameStart.hidden = true;
      guessForm.appendChild(guessNumInput);
      guessForm.appendChild(formSubmit);
    };
    // 遊戲開始 end
    
    // 使用正規式限制input只能輸入數字 start
    guessNumInput.addEventListener("input", (event) => {
        const value = event.target.value;
        event.target.value = value.replace(/[^0-9]/g, '');
    });
    // 使用正規式限制input只能輸入數字 end

    // 輸入數字後按enter送出 start
    guessNumInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            formSubmit.click();
        }
    });
    // 輸入數字後按enter送出 end

    // 輸入猜測數字 start
    formSubmit.addEventListener("click", () => {
        event.preventDefault();
        var guessNum = parseInt(guessNumInput.value, 10);

        // 沒有輸入任何資料時的處理 start
        if (isNaN(guessNum)) {
            guessForm.after(errorMessage);
            errorMessage.innerText = "猜一個數字吧！";
        // 沒有輸入任何資料時的處理  end

        // 不可輸入小於0或大於100的數字 start
        } else if (guessNum < 0 || guessNum > 100) {
            guessForm.after(errorMessage);
            errorMessage.innerText = "請輸入1~100之間的數字";
        // 不可輸入小於0或大於100的數字 end

        // 提示玩家在該局已經有猜過那個數字了 start
        } else if (guessRecord.num.includes(guessNum)) {
            errorMessage.innerText = "這個數字猜過啦～換一個試試看吧！"
        // 提示玩家在該局已經有猜過那個數字了 end

        // 猜對數字 start
        } else if (guessNum === randomNum) {
            guessForm.after(successMessage);
            successMessage.innerText = "Bingo！答案就是" + randomNum + "！" + "要開始新的一局嗎？";
            guessNumInput.disabled = true;  
            formSubmit.disabled = true;
            successMessage.after(replay);
            errorMessage.remove();
        // 猜對數字 end

        // 猜錯數字 start
        } else if (guessCount > 0) {
            var guessCompare = guessNum < randomNum;

            guessCount--;
            rate++;

            if (guessNum != randomNum) {
                gameText2.innerText = "剩餘" + guessCount + "次";
                guessForm.after(errorMessage);

                errorMessage.innerText = "猜錯了，正確數字比你猜的數字「" + guessNum + "」還要" + (guessCompare ? "高" : "低") + "。";

                // 傳送猜測紀錄至guessRecord start
                guessRecord.rate.push(rate);
                guessRecord.num.push(guessNum);
                guessRecord.memo.push(guessCompare ? "要高一點" : "要低一點");
                // 傳送猜測紀錄至guessRecord end

                // 把guessRecord的資料顯示出來 start
                var guessRecordLength = guessRecord.num.length;
                var str = "<h6>猜測紀錄：</h6>";

                for (var i = 0; i < guessRecordLength ; i++) {
                    var content = "<p>第 " + guessRecord.rate[i] + " 次：" + guessRecord.num[i] + "，" + guessRecord.memo[i] + "</p>";
                    str += content;
                }
                errorMessage.after(guessMemo);
                guessMemo.innerHTML = str;
                // 把guessRecord的資料顯示出來 end

                guessMemo.after(replay);

                // 次數用完 start
                if (guessCount == 0) {
                    guessNumInput.disabled = true;
                    formSubmit.disabled = true;
                    errorMessage.innerText = "很遺憾，你的10次機會已用完。正確的數字是" + randomNum + "。要開始新的一局嗎？"
                }
                // 次數用完 end
            }

        // 猜錯數字 end
        }
    });
    // 輸入猜測數字 end
});