window.onload = function () {
  let token = null, animation = null,userLatitude = 0,userLongitude = 0,
 loginPage = `<h1>Please Login</h1>
    <br />
    <form id="myLoginForm">
    <label>
    <span><b>Username</b></span>
    <input type='text' id='userName' value='mwp' required/> 
    </label>
    <br />   
    <label>
    <span><b>Password</b></span>     
    <input type='text' id='userPassword' value='123' required/> 
    </label>
    <br />  
    <button type="submit">login</button>
     </form>`,

    animationPage = `<h3 id="locationTag">Location will be here</h3>
      <textarea id="animationArea" cols="50" rows="20"></textarea>
      <br />
      <button id="loadAnimationBtn">load animation</button>
      <button id="logOutBtn">log out</button>
      `;


  document.getElementById("outlet").innerHTML = loginPage;
  document.getElementById("myLoginForm").onsubmit = async function (event) {
    event.preventDefault();
    let userName = document.querySelector("#userName").value;
    let userPassword = document.querySelector("#userPassword").value;
    let restoken = await getToken("http://mumstudents.org/api/login", {
      username: userName,
      password: userPassword
    });
    token = restoken.token;
    loadAnimation();
  };

  async function getToken(url = "", data = {}) {

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"

      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  async function getAnimations(url = "") {

    const response = await fetch(url, {
      headers: new Headers({
        Accept: "application/json",
        Authorization: "Bearer " + token
      })
    });
    return await response.text();
  }

  
  let loadAnimation = async function () {
    try {

      animation = await getAnimations("http://mumstudents.org/api/animation");
      animationArr = animation.split("=====\n");
      document.getElementById("outlet").innerHTML = animationPage;
      getLocation();
      document.getElementById("loadAnimationBtn").onclick = () =>
        loadAnimation();
      document.getElementById("logOutBtn").onclick = () => logOut();
      loadAnimationWithInterval();
    }
    catch (err) {
      console.log(err);
    }
  };

  function loadAnimationWithInterval() {
    let animationArea = document.getElementById("animationArea");
    let animationLength = animationArr.length;
    let counter = 0;
    animationInterval = setInterval(() => {
      if (animationLength > 0 && counter < animationLength) {
        animationArea.innerHTML = animationArr[counter];
        counter++;
      } else {
        counter = 0;
      }
    }, 200);
  }

  function logOut() {
    clearInterval(animationInterval);

    document.getElementById("outlet").innerHTML = loginPage;
    token = null;
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    fetch(
      `http://www.mapquestapi.com/geocoding/v1/address?key=SfsY2tGYHQs6eSYNdkGOysxRyL5Dz4cl&location=${userLatitude},${userLongitude}`
      
    )
      .then(res => res.json())
     
      .then(data => {
        let address = data.results[0].locations[0];
        console.log(address);
        
        let street = address.street;
        let state = address.adminArea3;
        let country =address.adminArea1;
        document.getElementById( "locationTag").innerHTML = 
        `Wellcome All from ${street}, ${state}, ${country}!`;
      });
  }



}

