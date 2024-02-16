
courseData = process(courseData);
pcs = process(pcs);
students = process(students);
passwords = process(passwords);
var afaEmail = courseData[3];

const evalLink = "https://evaluation.qa.com/Login.aspx?course=" + courseData[1] + "&pin=" + courseData[2];

getElement("trainerEmail").innerHTML = trainer;
getElement("courseTitle").innerHTML = courseData[0];
getElement("email").value = passwords[0];
getElement("password1").value = passwords[1];
getElement("password2").value = passwords[2]; 
getElement("courseMaterial").href = courseData[4]; 
getElement("mimeo").value = courseData[5];  

// setup combobox
const cboValues = [
    { title: "Select an item", msg: '', timer: 0 },
    { title: "Finish lab", msg: 'Please put a ✔ when you have completed the lab', timer: 0   },
    { title: "ready to start", msg: 'Please put a ✔ when you are ready to start 🏍',timer: 0  },
    { title: "Coffee", msg: 'Let\'s take a 15 minutes break ☕'  , timer:15        },
    { title: "Lunch", msg: 'Let\'s take 60 minutes for lunch 🍔', timer: 60        },
    { title: "mini break", msg: 'Let\'s take a 5 minutes mini break ☕', timer: 5  },
    { title: "Comment", msg: "Please write comments about the course", link: commentsUrl, timer: 0 },
    { title: "Evaluation", msg: "Please complete the course evaluation", link: evalLink , timer: 0 },
    { title: "Display intro", msg: "", timer: 0 }
];

var cboMessages = getElement('cboMessages');
cboValues.forEach(x => {
    var op = document.createElement('option');
    op.innerHTML = x.title;
    cboMessages.appendChild(op);
});

cboMessages.addEventListener("change", () => {
    let i = cboMessages.selectedIndex;
    getElement("txtArea").value = cboValues[i].msg;
    if (cboValues[i].link)
        window.open(cboValues[i].link, '_blank');
    if (cboValues[i].timer != 0) {
        getElement("timer").value = cboValues[i].timer;
        startTimer('timer', 'divTimer');
    }
    else{
        stopTimer();
        getElement("divTimer").innerHTML = "";
        setMessage("");
    }
});

students.forEach((stu,i) => {
    var ol = getElement("pcs");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = pcs[i];
    a.target = "_blank";
    a.innerHTML = stu.split(',')[1];
    li.appendChild(a);
    ol.appendChild(li);
});

document.querySelectorAll('input').forEach(txt =>
    txt.addEventListener('click', (event) => {
        event.target.select();
        navigator.clipboard.writeText(event.target.value);
        event.target.setAttribute("readonly", "true");
    }));

function afa() {
    navigator.clipboard.writeText(afaEmail)
        .then(() => {
            window.open(afaPath, '_blank');
        })
        .catch((error) => { alert(`Copy failed! ${error}`); });
}

function process(dataStr) {
    var data = dataStr.split("\n");
    data = data.map(item => { return item.trim(); });
    if (data[0] === '') data.shift();
    if (data[data.length - 1] === '') data.pop();
    return data;
}

function getElement(id) {
    return document.getElementById(id);
}
//========================Timer and messages==============================
var myTimer = null;
function stopTimer() {
    if (myTimer !== null)
        clearInterval(myTimer);
}
function startTimer(timerName, divCountdown) {
    stopTimer();
    setMessage("");

    let mins = parseInt(getElement(timerName).value);
    let seconds = mins * 60;

    myTimer = setInterval(function () {

        var minutes = seconds / 60 | 0;

        if (seconds < 0) {
            stopTimer();
            setMessage(mins + " minutes passed. Ended at " + getTime());
            new Audio(audioFile).play();
            return;
        }
        getElement(divCountdown).innerHTML = minutes + ":" + (seconds - minutes * 60);
        seconds--;
    }, 1000);
}

function setMessage(msg) {
    document.getElementById('message').innerHTML = msg;
}

function getTime() {
    var today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}


