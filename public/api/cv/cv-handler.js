const form=document.getElementById('upload-photo')
const avatar=document.getElementById('avatar')
const photo=document.getElementById('input-photo')
form.addEventListener('change',function(){
    const choosedFile=photo.files[0]
    if(choosedFile){
        console.log("new file")
        const reader=new FileReader()
        reader.addEventListener('load',function(){
            avatar.setAttribute('src',reader.result)
        })
        reader.readAsDataURL(choosedFile)
    }
})
//prepare html
const button=document.getElementById('qr')
const div=document.createElement('div')
div.setAttribute('id','viniette')
const container=document.createElement('div')
container.setAttribute('id','qr-ctn')
const qrcode=document.createElement('div')
qrcode.setAttribute('id','qrcode')
const text=document.createElement('p')
text.innerHTML='Scan me!'
text.setAttribute('id','qrtext')
container.appendChild(qrcode)
container.appendChild(text)
div.appendChild(container)
//qrcode
button.addEventListener('click',()=>{
    document.body.appendChild(div)
    var qrcode = new QRCode(document.getElementById("qrcode"), {
	    text: '{"fullname": '+document.getElementById('username').innerHTML+',"qualification": '+document.getElementById('qualification').innerHTML+',"about": '+document.getElementById('about-data').innerHTML+',"experience": '+document.getElementById('experience-data').innerHTML+"}",
	    width: 256,
	    height: 256,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
    });
})
//restore
div.addEventListener('click',()=>{
    document.body.removeChild(div)
})