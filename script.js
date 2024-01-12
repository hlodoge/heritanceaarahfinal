
  const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");

  if (!isPageRefreshed || isPageRefreshed === "false") {
    sessionStorage.setItem("isPageRefreshed", true);
  }

  const initialOverallBookingCost = 0;
  updateBookingUI(0, initialOverallBookingCost);

  const hotelForm = document.querySelector('.reservation form');
  hotelForm.addEventListener('submit', function (event) {
    event.preventDefault();
    bookNow();
  });

  const adventureForm = document.querySelectorAll('.reservation form')[1];
  adventureForm.addEventListener('submit', function (event) {
    event.preventDefault();
    bookAdventure();
  });

  const favoritesButton = document.getElementById("favorites");
  favoritesButton.addEventListener("click", addToFavorites);

  const loyaltyButton = document.getElementById("loyalty");
  loyaltyButton.addEventListener("click", checkLoyalty);

  function calculateHotelCost() {
    const roomType = document.getElementById("room_type").value;
    const numAdults = parseInt(document.getElementById("numAdults").value);
    const numChildren = parseInt(document.getElementById("numChildren").value);
    const noRooms = parseInt(document.getElementById("norooms").value);
    const hasExtraBed = document.getElementById("extrabeds").value > 0;
    const promoCode = document.getElementById("promocode").value;
    const duration = parseInt(document.getElementById("duration").value);

    let roomCost;

    switch (roomType) {
      case "single":
        roomCost = 25000.00;
        break;
      case "double":
        roomCost = 35000.00;
        break;
      case "triple":
        roomCost = 40000.00;
        break;
      default:
        roomCost = 0;
    }

    let totalCost = roomCost * noRooms;
    totalCost += numChildren * 5000.00;
    totalCost += hasExtraBed ? 8000.00 : 0;
    
    if (promoCode === "Promo123") {
      totalCost *= 0.95;
    }

  
    totalCost *= duration;

    return totalCost;
  }

  function calculateAdventureCost() {
    const adventureType = document.getElementById("adventuretype").value;
    const hasGuide = document.getElementById("guide").checked;

    switch (adventureType) {
      case "divingforlocaladults":
        return 5000.00 + (hasGuide ? 1000.00 : 0);
      case "divingforlocalkids":
        return 2000.00 + (hasGuide ? 500.00 : 0);
      case "divingforforeignadults":
        return 10000.00 + (hasGuide ? 1000.00 : 0);
      case "divingforforeignkids":
        return 5000.00 + (hasGuide ? 500.00 : 0);
      default:
        return 0;
    }
  }

  function updateBookingUI(currentBookingCost, overallBookingCost, bookingDetails) {
    const currentBookingElement = document.getElementById("currentbooking");
    const currentBookingCostElement = document.getElementById("currentbookingcost");

    const overallBookingElement = document.getElementById("overallbooking");
    const overallBookingCostElement = document.getElementById("overallbookingcost");

    currentBookingElement.innerHTML = "";
    currentBookingCostElement.textContent = `Cost: LKR ${currentBookingCost.toFixed(2)}`;

    overallBookingElement.innerHTML = "";
    overallBookingCostElement.textContent = `Total Cost: LKR ${overallBookingCost.toFixed(2)}`;

    if (bookingDetails) {
      currentBookingElement.innerHTML += bookingDetails.current;
      overallBookingElement.innerHTML += bookingDetails.overall;
    }
  }

  function getBookingDetails(type) {
    const roomType = document.getElementById("room_type").value;
    const numAdults = parseInt(document.getElementById("numAdults").value);
    const numChildren = parseInt(document.getElementById("numChildren").value);
    const noRooms = parseInt(document.getElementById("norooms").value);
    const hasExtraBed = document.getElementById("extrabeds").value > 0;
    const promoCode = document.getElementById("promocode").value;

    const adventureType = document.getElementById("adventuretype").value;
    const hasGuide = document.getElementById("guide").checked;

    if (type === "current") {
      return `<p>Room Type: ${roomType}, Adults: ${numAdults}, Children: ${numChildren}, Rooms: ${noRooms}, Extra Bed: ${hasExtraBed ? "Yes" : "No"}, Promo Code: ${promoCode}</p>`;
    } else if (type === "overall") {
      return `<p>Adventure Type: ${adventureType}, Guide: ${hasGuide ? "Yes" : "No"}</p>`;
    }

    return "";
  }

  function bookNow() {
    const currentBookingCost = calculateHotelCost();
    const overallBookingCost = parseFloat(document.getElementById("overallbookingcost").textContent.split(" ")[3]) + currentBookingCost;

    const bookingDetails = {
      current: getBookingDetails("current"),
      overall: getBookingDetails("overall"),
    };

    updateBookingUI(currentBookingCost, overallBookingCost, bookingDetails);
  }

  function bookAdventure() {
    const adventureType = document.getElementById("adventuretype").value;
    const currentAdventureCost = calculateAdventureCost();
    const overallBookingCost = parseFloat(document.getElementById("overallbookingcost").textContent.split(" ")[3]) + currentAdventureCost;

    const bookingDetails = {
      current: getBookingDetails("current"),
      overall: getBookingDetails("overall"),
    };

    alert(`Thank you for booking ${adventureType}! Cost: LKR ${currentAdventureCost.toFixed(2)}`);

    updateBookingUI(currentAdventureCost, overallBookingCost, bookingDetails);
  }

  function addToFavorites() {
    const currentBookingCost = calculateHotelCost() + calculateAdventureCost();
    const bookingDetails = {
      current: getBookingDetails("current"),
      overall: getBookingDetails("overall"),
    };
    
    // Save the current booking details to local storage, overwriting any existing favorite
    localStorage.setItem("favoriteBookingDetails", JSON.stringify(bookingDetails));
    localStorage.setItem("favoriteBookingCost", currentBookingCost);
    
    alert("Booking added to favorites!");
  }

  function checkLoyalty() {
    const numRooms = parseInt(document.getElementById("norooms").value);
    const loyaltyPoints = numRooms > 3 ? numRooms * 20 : 0;
    

   
    localStorage.setItem("loyaltyPoints", loyaltyPoints);


    alert(`You have earned ${loyaltyPoints} loyalty points!`);
  }
;
