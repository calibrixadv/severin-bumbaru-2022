const nav=document.getElementById('nav-icon')
const bar=document.getElementById('nav-bar')
const arrow=document.getElementById('nav-arrow')
const main=document.getElementById('main')
const blob=document.getElementById('blob-phn')
const cc=document.getElementById('nav-cc')
const items=document.getElementById('nav-items')
nav.addEventListener('click',(event)=>{
    event.preventDefault()
    bar.setAttribute('class','ctn active')
    nav.setAttribute('class','phone deactive')
    arrow.setAttribute('class','phone active')
    blob.setAttribute('class','phone active')
    cc.setAttribute('class','phone active')
    items.setAttribute('class','active')
})
arrow.addEventListener('click',(event)=>{
    event.preventDefault()
    bar.setAttribute('class','ctn')
    nav.setAttribute('class','phone')
    blob.setAttribute('class','phone deactive')
    arrow.setAttribute('class','phone deactive')
    cc.setAttribute('class','phone deactive')
    items.setAttribute('class','deactive')
})
var x = window.matchMedia("(max-width: 768px)")
const source=document.getElementById('target')
const child=document.getElementById('third-nest')
function change(x){
    if(x.matches){
        source.appendChild(child)
    }
    else{
        if(source.contains(child))
            source.removeChild(child)
        document.getElementById('second-nest').appendChild(child)
    }
}
x.addListener(change)
change(x)