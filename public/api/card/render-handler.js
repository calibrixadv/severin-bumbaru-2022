document.getElementById('location').innerHTML='<b>Adresă:</b>'+localStorage.getItem('location')
document.getElementById('service').innerHTML='<b>Comunicare:</b>'+localStorage.getItem('service')
document.getElementById('contact').innerHTML='<b>Telefon/Fax:</b>'+localStorage.getItem('contact')
document.getElementById('site').innerHTML='<b>Site:</b>'+localStorage.getItem('site')
document.getElementById('name').innerHTML=localStorage.getItem('name')
document.getElementById('info').innerHTML=localStorage.getItem('info')
function initMap() {
  const uluru = { lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('long')) };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru,
    mapId:'ba651961b19f4f8f'
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}

window.initMap = initMap;