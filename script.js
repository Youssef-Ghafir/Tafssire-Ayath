let btn_mode = document.querySelector('.side > .btn');
if(window.localStorage.getItem('Dark')) {
    btn_mode.classList.toggle('dark');
    document.body.classList.toggle('dark');
}

let info = document.querySelector('.info');
let info_sec = document.querySelector('.info_sec');
info_sec.addEventListener('click',e => {
    if(e.target.classList.contains('info_sec')) {
        info_sec.classList.remove('show')
        info_sec.children[0].classList.remove('show')
    }
})
info.addEventListener('click',_ => {
    info_sec.classList.add('show');
    setTimeout(() => {
        info_sec.children[0].classList.add('show')
    }, 300);
})

btn_mode.addEventListener('click', _ => {
    btn_mode.classList.toggle('dark');
    document.body.classList.toggle('dark');
    if(document.body.classList.contains('dark')) {
        window.localStorage.setItem('Dark',true)
    }else {
        window.localStorage.removeItem('Dark')
    }
})


let start_search = document.getElementById('start_search');
let container_search = document.querySelector('.container_search');
start_search.addEventListener('click',_ => {
    container_search.classList.add('show');
    container_search.addEventListener('click',e => {
        if(e.target.classList.contains('container_search')) {
            container_search.children[0].classList.remove('show');
            setTimeout(() => {
                container_search.classList.remove('show');

            }, 300);
        }
    })
    setTimeout(() => {
        container_search.children[0].classList.add('show');
    }, 200);
})


// Start Geeting Data
async function GetData(url) {
    try {
        let data = await fetch(url);
        if(!data.ok) {
            throw new Error('Opps An Error Happend !');
        }
        let result = await data.json()
        return result;
    }catch(e) {
        console.log(e)
    }
}


let select_box = document.querySelectorAll('.select_box ');
let value_select = document.querySelector('.value');
function RemoveClass(current,name,el) {
    el.forEach(e => {
        e.classList.remove(name);
    })
    current.classList.add(name)
}



function GetNumberAyath(e,etat) {
    if(etat) {
        let ul_list = select_box[1].querySelector('.bx_2 ul')
        ul_list.innerHTML = '';
        for (let i = 1; i <= e.getAttribute('data-number'); i++) {
            ul_list.innerHTML += `<li>${i}</li>`
        }
    }else {
        select_box[1].querySelector('.bx_2 ul').innerHTML = `<p class="empty">اختر اولا سورة !</p>`
    }
}
GetNumberAyath(false);
let choosen = ['','',''];
select_box.forEach(e => {
    e.addEventListener('click',b => {
        if(b.target.classList.contains('value_select') || b.target.classList.contains('value')) {
            if(!e.classList.contains('show')) {
                RemoveClass(e,'show',select_box)
            }else {
                e.classList.remove('show')
            }
    }
    })
})
function List(e,item) {
    RemoveClass(e,'active',item)
    e.parentElement.parentElement.parentElement.children[0].children[0].textContent = e.textContent;
    e.parentElement.parentElement.parentElement.classList.remove('show');
}
GetData('http://api.alquran.cloud/v1/surah').then(result => {
    result.data.forEach(e => {
        select_box[0].querySelector('.bx_2 ul').innerHTML += `<li data-index="${e.number}" data-number= "${e.numberOfAyahs}">${e.name}</li>`
    })
    let list_surahs = select_box[0].querySelectorAll('.bx_2 ul li');
    list_surahs.forEach(e => {
        e.addEventListener('click',_=> {
            choosen[0]= e.getAttribute('data-index');
            List(e,list_surahs)
            let input = select_box[1].children[1].children[0].children[0];
            select_box[1].children[1].children[0].style.display = 'block' 
            GetNumberAyath(e,true)
            // ================
            let list_number_ayah = select_box[1].querySelectorAll('.bx_2 ul li');
            input.addEventListener('keyup',_ => {
                list_number_ayah.forEach(element => {
                    if(element.textContent.startsWith(input.value)) {
                        element.style.display = 'block'
                    }else {
                        element.style.display = 'none'
                    }
                })
            })
            list_number_ayah.forEach(el => {
                el.addEventListener('click', _ => {
                    List(el,list_number_ayah)
                    choosen[1] = el.textContent;
                })
            })
        })
    })
})

GetData('http://api.quran-tafseer.com/tafseer/').then(result => {
   for (let i = 0; i < 8; i++) {
    select_box[2].querySelector('.bx_2 ul').innerHTML += `<li data-index="${result[i].id}">${result[i].name}</li>`
}
let tafasser_list = select_box[2].querySelectorAll('.bx_2 ul li');
tafasser_list.forEach(e => {
    e.addEventListener('click',_=> {
        choosen[2]= e.getAttribute('data-index');
        List(e,tafasser_list)
    })})
}) 
let start_search_2 = document.querySelector('.start_search');
let result = document.querySelector('.result');
start_search_2.addEventListener('click',_ => {
    if(!choosen.includes('')) {
        let url  = `http://api.quran-tafseer.com/tafseer/${choosen[2]}/${choosen[0]}/${choosen[1]}`;
        let box = result.children[0].children;
        GetData(url).then(data => {
            ShowResult(true)
            box[1].children[0].textContent = data.tafseer_name;
            box[2].children[0].textContent = data.text
            return data
        }).then(re => {
             return GetData(`http://api.quran-tafseer.com${re.ayah_url}`)
        }).then(re_2 => {
            box[1].children[1].textContent = re_2.text 
        })
    }
})
function ShowResult(etat) {
    if(etat) {
        let nav = document.querySelector('.nav'),
            section = document.querySelector('.section')
        nav.style.display = 'none';
        section.style.display = 'none';
        container_search.classList.remove('show')
        result.style.display = 'block'
        container_search.children[0].classList.remove('show');
        setTimeout(() => {
            result.classList.add('show')
        }, 200);
    }else {
        let nav = document.querySelector('.nav'),
        section = document.querySelector('.section')
        nav.style.display = 'block';
        section.style.display = 'flex';
        result.classList.remove('show')
        setTimeout(() => {
            result.style.display = 'none'
            container_search.classList.add('show')
            setTimeout(() => {
                container_search.children[0].classList.add('show');
            }, 200);
        }, 200);
    }
}
let restart = document.getElementById('restart');
restart.addEventListener('click',_ => {
    ShowResult(false);    
})
