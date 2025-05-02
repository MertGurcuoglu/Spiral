// Chart.js global değişkeni
let weeklyChart;
const form = document.getElementById("mota-form");

// Menü Toggle
// Menü açma/kapama
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");

// Ana sayfada göster
sidebar.classList.remove("hidden");
filters.classList.remove("hidden");

// Diğer sayfalarda gizle
sidebar.classList.add("hidden");
filters.classList.add("hidden");

menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("hidden");
});

// menuden sayfaya tıklayınca sayfa acılsın menu kapansın
document.getElementById("menu-home").addEventListener("click", () => {
  showHomePage();
  sideMenu.classList.add("hidden");
});

document.getElementById("menu-calendar").addEventListener("click", () => {
  showCalendarPage();
  updateCalendarChart();
  sideMenu.classList.add("hidden");
});

document.getElementById("menu-category").addEventListener("click", () => {
  showCategoryPage();
  sideMenu.classList.add("hidden");
});
document.getElementById("menu-darkmode").addEventListener("click", () => {
  toggleDarkMode();
  sideMenu.classList.add("hidden");
});

// sayfa bolumlerı bunlar olmadan calısmaz butonlar
const mainContainer = document.getElementById("main-container");
const calendarSection = document.getElementById("calendar-section");
const categorySection = document.getElementById("category-section");

// sayfa gecıs fonksıyonları
function showHomePage() {
  mainContainer.classList.remove("hidden");
  calendarSection.classList.add("hidden");
  categorySection.classList.add("hidden");
  sidebar.classList.remove("hidden");
  filters.classList.remove("hidden");
}

function showCalendarPage() {
  mainContainer.classList.add("hidden");
  calendarSection.classList.remove("hidden");
  categorySection.classList.add("hidden");
  sidebar.classList.add("hidden");
  filters.classList.add("hidden");
  renderCalendar();
}

function showCategoryPage() {
  mainContainer.classList.add("hidden");
  calendarSection.classList.add("hidden");
  categorySection.classList.remove("hidden");
  sidebar.classList.add("hidden");
  filters.classList.add("hidden");
  renderCategoryHabits();
}

// sayfa ılk acılsıgında ana sayfa gorunsun
window.addEventListener("load", showHomePage);

//localstorage ıslemlerı
//tarayıcının yerel depolama alanından habits
//anahtarıyla saklanan veriyi almak
function getHabits() {
  return JSON.parse(localStorage.getItem("habits") || "[]");
}

//ılk html tamamen yuklendıgınde tetıklenecek
document.addEventListener("DOMContentLoaded", function () {
  renderHabits(); // sayfa açıldığında tüm alışkanlıkların gelmesı ıcın

  document
    //id si categoryfilter olan select elementindeki change olayını dinliyor
    //category seçimi degıstıgınde renderHabits tekrar cagrılarak
    //fıltrelenmıs alıskanlıkların goruntulenmesı saglanır
    .getElementById("categoryFilter")
    .addEventListener("change", renderHabits);
  document
    //id si searchınput olan select elementindeki input olayını dinliyor
    //search kutuwuna bır seyler ayzıldıgında renderHabits tekrar cagrılarak
    //fıltrelenmıs alıskanlıkların goruntulenmesı saglanır
    .getElementById("searchInput")
    .addEventListener("input", renderHabits);
});
//takvım ıcın

const daysOfWeek = ["Pazartesi", "Salı", "Çarşaamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

//bu  fonk gorevı takvım gorunumunu dınamık olarak olusturup html yerlestırmek
function renderCalendar() {
  const container = document.getElementById("calendar-container");
  container.innerHTML = "";

  const habits = getHabits();

  //gunler ıcın dongu baslatır
  daysOfWeek.forEach((day, i) => {
    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day"; //olusturulan dıv elementıne calendar-day css sınıfı atanıyor
    dayBox.innerHTML = `<strong>${day}</strong><br/>`;

    //dongunun her gunu ıcın alıskanlık tamamlama sayısı tutulacak
    let count = 0;
    habits.forEach((habit) => {
      if (habit.days[i]) count++;
    });

    dayBox.innerHTML += `<span>${count} tamamlanan</span>`;

    dayBox.addEventListener("click", () => {
      openHabitModal(i);
    });

    container.appendChild(dayBox);
  });
}

//kategori ekranı ıcın
function renderCategoryHabits() {
  const selectedCategory = document.getElementById(
    "categoryFilterDropdown"
  ).value;
  const allHabits = getHabits();

  const filtered = allHabits.filter(
    (habit) => selectedCategory === "" || habit.category === selectedCategory
  );

  const list = document.getElementById("category-habit-list");
  list.innerHTML = "";

  filtered.forEach((habit) => {
    const li = document.createElement("li");
    li.textContent = habit.name;
    list.appendChild(li);
  });
}
document
  .getElementById("categoryFilterDropdown")
  .addEventListener("change", renderCategoryHabits);

//takvımdekı bır gune tıklandıgında acılan modal(acılır pencere ıcerıgı ıcın)
function openHabitModal(dayIndex) {
  const modal = document.getElementById("habit-modal");
  const habitList = document.getElementById("modal-habit-list");
  const modalTitle = document.getElementById("modal-title");

  const habits = getHabits(); // localStorage'dan alışkanlık verılerı alınır

  habitList.innerHTML = "";
  modalTitle.textContent = `${daysOfWeek[dayIndex]} Günü Alışkanlıkları`;

  habits.forEach((habit, habitIndex) => {
    // tum alıskanlıklar bır donguye alınır
    //her bır alıskanlık ıcın bır lıste ogesı olusturulur
    const li = document.createElement("li");

    const label = document.createElement("label"); //cheackbox ve alıskanlık adını bir arada tutmak ıcıın kullanılır
    label.style.display = "flex"; //yan yana yazılabılmesı ıcın
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.days[dayIndex];

    checkbox.addEventListener("change", () => {
      //checkbox degerı degıstıgınde calısacak
      //o gunu ısaretlemek ıcın
      habit.days[dayIndex] = checkbox.checked;
      habits[habitIndex] = habit;
      saveHabits(habits);
      updateChart();
      loadHabits(); //kartlarda anlık olarak guncellensın dıye
      renderCalendar();
      updateCalendarChart();

      //kullanıcıya guncellendı messajı
      const bilgi = document.createElement("small");
      bilgi.textContent = "✔ Güncellendi!";
      bilgi.style.color = "green";
      bilgi.style.marginLeft = "10px";
      label.appendChild(bilgi);

      setTimeout(() => bilgi.remove(), 1000);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + habit.name));

    li.appendChild(label);
    habitList.appendChild(li);
  });

  modal.style.display = "block";
}
//actıgımız gunlerı sonrasında kapatmak ıcın
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("habit-modal").style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target.id === "habit-modal") {
    document.getElementById("habit-modal").style.display = "none";
  }
});

//kategorılerı ve searchyı fıltrelemek için
function renderHabits() {
  const habitList = document.getElementById("habit-list");
  const selectedCategory = document.getElementById("categoryFilter").value;
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const storedHabits = getHabits();

  const filteredHabits = storedHabits.filter((habit) => {
    const matchesCategory =
      selectedCategory === "" || habit.category === selectedCategory;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  habitList.innerHTML = "";

  filteredHabits.forEach((habit) => {
    addHabitToList(habit.name, habit.days, habit.category);
  });
}

function saveHabits(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}
// alıskanlıkları yuklemek ve sıralamak ıcın
function loadHabits() {
  //anlık fıltreleme yapmak ıcın
  const savedHabits = getHabits();
  const search =
    document.getElementById("searchInput")?.value?.toLowerCase() || "";
  const categoryFıltered = document.getElementById("categoryFilter");
  const category =
    categoryFıltered?.selectedIndex > 0 ? categoryFıltered.value : "";

  const filteredHabits = savedHabits.filter((habit) => {
    const nameW = habit.name.toLowerCase().includes(search);
    const categoryW =
      category === "" ||
      habit.category?.toLowerCase() === category.toLowerCase();
    return nameW && categoryW;
  });

  // hangısının tamamlanma yuzdesı daha fazlaysa o uste
  filteredHabits.sort((a, b) => {
    const aCompleted = a.days.filter((day) => day).length;
    const bCompleted = b.days.filter((day) => day).length;
    return bCompleted - aCompleted;
  });

  const list = document.getElementById("habit-list");
  list.innerHTML = ""; // lısteyı temızlemek ıcın

  filteredHabits.forEach((habit) => {
    addHabitToList(habit.name, habit.days, habit.category);
  });

  updateChart(); // aynı anda grafık de guncellenmelı
}
document.getElementById("searchInput").addEventListener("input", loadHabits);
document
  .getElementById("categoryFilter")
  .addEventListener("change", loadHabits);

// sayfa geldıgınde alıskanlıklarda gelecek onu yukluyoruz
window.addEventListener("load", loadHabits);

//form gonderılınce
form.addEventListener("submit", function (event) {
  event.preventDefault();
  loadHabits();
  updateChart();

  const input = document.getElementById("mota-input");
  const habit = input.value.trim();
  if (!habit) return;

  //kategorı verısı ıcın
  if (!document.getElementById("categoryFilter")?.value) {
    alert("Lütfen bir category seçin!");
    return;
  }

  const selectedCategory =
    document.getElementById("categoryFilter")?.value || "Genel";
  const habits = getHabits();
  if (habits.find((h) => h.name.toLowerCase() === habit.toLowerCase())) {
    alert("Bu isimde bir alışkanlık zaten var!");
    return;
  }
  //kategorı eklendı artık
  addHabitToList(
    habit,
    [false, false, false, false, false, false, false],
    selectedCategory
  );

  input.value = "";
});

//alıskanlık lısteleme ve kutular
function addHabitToList(
  habitTextLocal,
  dayStates = [false, false, false, false, false, false, false],
  categoryVerisi = ""
) {
  const categorySecimi =
    categoryVerisi ||
    document.getElementById("categoryFilter")?.value ||
    "Genel";

  //eklenen her alışkanlıgı kalıcı lısteye eklıyor
  const habits = getHabits();
  //sadece yenı ekleme sırasında kaydet (ılk yuklemede bır daha ekleme yapmasın)
  if (
    !habits.find((h) => h.name.toLowerCase() === habitTextLocal.toLowerCase())
  ) {
    const habitObj = {
      name: habitTextLocal,
      days: [...dayStates],
      category: categorySecimi,
    };
    habits.push(habitObj);
    saveHabits(habits);
  }
  const list = document.getElementById("habit-list");
  const listItem = document.createElement("li");

  const habitTitle = document.createElement("h3");
  habitTitle.textContent = habitTextLocal;
  listItem.appendChild(habitTitle);

  const categoryLabel = document.createElement("span");
  const mevcutHabit = getHabits().find((h) => h.name === habitTextLocal);
  categoryLabel.textContent = `category: ${mevcutHabit?.category || "Genel"}`;
  categoryLabel.className = "category-etiket";
  listItem.appendChild(categoryLabel);

  //gun ıcın etıketler
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr"];

  const labelRow = document.createElement("div");
  labelRow.className = "day-label-row";

  for (let i = 0; i < 7; i++) {
    const label = document.createElement("span");
    label.className = "day-label";
    label.textContent = daysOfWeek[i];
    labelRow.appendChild(label);
  }
  listItem.appendChild(labelRow);

  const tracker = document.createElement("div"); //her alışkanlık satırı ıcın dıv olusturduk
  tracker.className = "habit-tracker"; //bu div ıcınde 7 kutucuk tutacak

  for (let i = 0; i < 7; i++) {
    const dayBox = document.createElement("span");
    dayBox.className = "day-box";
    dayBox.textContent = dayStates[i] ? "✅" : "⬜"; //bos beaz bır  kutu

    dayBox.addEventListener("click", () => {
      dayStates[i] = !dayStates[i];
      dayBox.textContent = dayStates[i] ? "✅" : "⬜";

      const habits = getHabits();
      const habitToUpdate = habits.find((h) => h.name === habitTextLocal);
      if (habitToUpdate) {
        habitToUpdate.days = dayStates;
        saveHabits(habits);
      }

      updateAnalysis();
      updateChart();
      loadHabits();
    });

    tracker.appendChild(dayBox);
  }

  listItem.appendChild(tracker);

  const analysis = document.createElement("p");
  analysis.className = "habit-analysis";

  function updateAnalysis() {
    //kutuların hepsını kontrol edıp kac tanesı olmus onu analız yazısına ekleyecegız
    const completed = dayStates.filter((d) => d).length;
    const yuzde = Math.round((completed / 7) * 100);
    analysis.textContent = `${completed}/7 gün tamamlandı (%${yuzde})`;
    if (yuzde <= 33) {
      listItem.style.backgroundColor = "#ffcccc";
    } else if (yuzde <= 66) {
      listItem.style.backgroundColor = "#fff4cc";
    } else {
      listItem.style.backgroundColor = "#ccffcc";
    }
  }
  updateAnalysis();
  listItem.appendChild(tracker);
  listItem.appendChild(analysis);

  //eklenen alıskanlıkları duzenlemek ıcın
  const editButton = document.createElement("button");
  editButton.textContent = "✏️";
  editButton.className = "edit-btn";

  editButton.addEventListener("click", () => {
    const newName = prompt("Yeni alışkanlık ismi girin:", habitTextLocal);
    if (!newName || newName.trim() === "") return;

    const habits = getHabits();
    const currentName = habits.find(
      (h) => h.name.toLowerCase() === newName.toLowerCase()
    );
    if (currentName) {
      alert("Bu isimde bir alışkanlık zaten var");
      return;
    }
    //localStorage guncellemek ıcın
    const habitToUpdate = habits.find((h) => h.name === habitTextLocal);
    if (habitToUpdate) {
      habitToUpdate.name = newName;
      saveHabits(habits);
    }
    //yapılanın dırek ekranda gorunmesı ıcın
    habitTitle.textContent = newName;
    //butonun ısaret ettıgı ısmı degıstırmek ıcın
    habitTextLocal = newName;
  });

  //eklenen alıskanlıkları sılmek ıcın
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑️";
  deleteButton.className = "delete-btn";

  deleteButton.addEventListener("click", () => {
    const updatedHabits = getHabits().filter(
      (h) => h.name.toLowerCase() !== habitTextLocal.toLowerCase()
    );
    saveHabits(updatedHabits);
    listItem.remove();
    updateChart();
  });
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  list.appendChild(listItem);
}
let calendarChart;

//garfıgı guncellemek ıcın
function updateChart() {
  const habits = getHabits();
  const dayLabels = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const dayCounts = new Array(7).fill(0);

  habits.forEach((habit) => {
    habit.days.forEach((done, index) => {
      if (done) dayCounts[index]++;
    });
  });

  if (!weeklyChart) {
    // ılk kez grafık olusturuluyorsa
    const chartCanvas = document.getElementById("weeklyReportChart");
    if (!chartCanvas) return;

    const ctx = document.getElementById("weeklyReportChart").getContext("2d");
    weeklyChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: "Tamamlanan alışkanlık sayısı",
            data: dayCounts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  } else {
    // Varsa sadece güncelle
    weeklyChart.data.datasets[0].data = dayCounts;
    weeklyChart.update();
    renderCalendar();
  }
}

//kategorı bolumundekı lısteyı ve graafıgı guncellemek ıcın
let categoryChart;
function renderCategoryHabits() {
  const selectedCategory = document.getElementById(
    "categoryFilterDropdown"
  ).value;
  const habits = getHabits();

  const filteredHabits = habits.filter(
    (habit) => selectedCategory === "" || habit.category === selectedCategory
  );

  const list = document.getElementById("category-habit-list");
  list.innerHTML = "";

  filteredHabits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = "category-habit-item";
    li.textContent = habit.name;
    list.appendChild(li);
  });

  updateCategoryChart(filteredHabits);
}

// kategorı grafıgı guncelle
function updateCategoryChart(habits) {
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const dayCounts = new Array(7).fill(0);

  habits.forEach((habit) => {
    habit.days.forEach((done, index) => {
      if (done) dayCounts[index]++;
    });
  });

  if (!categoryChart) {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    categoryChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: "Tamamlanan Alışkanlıklar (Kategoriye göre)",
            data: dayCounts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  } else {
    categoryChart.data.datasets[0].data = dayCounts;
    categoryChart.update();
  }
}

// guncelle
document
  .getElementById("categoryFilterDropdown")
  .addEventListener("change", renderCategoryHabits);

//takvım ıcın grafıgı guncelleme
function updateCalendarChart() {
  const habits = getHabits();
  const dayLabels = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const dayCounts = new Array(7).fill(0);

  habits.forEach((habit) => {
    habit.days.forEach((done, index) => {
      if (done) dayCounts[index]++;
    });
  });

  if (!calendarChart) {
    const ctx = document.getElementById("calendarChart").getContext("2d");
    calendarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: "Tamamlanan Alışkanlıklar (Takvim)",
            data: dayCounts,
            backgroundColor: "rgba(40, 167, 69, 0.6)",
            borderColor: "rgba(40, 167, 69, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
    });
  } else {
    calendarChart.data.datasets[0].data = dayCounts;
    calendarChart.update();
  }
}
document.getElementById("menu-calendar").addEventListener("click", () => {
  showCalendarPage();
  updateCalendarChart();
});

const darkModeBtn = document.getElementById("menu-darkmode");
function updateDarkModeButton() {
  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.innerHTML = "☀️ Aydınlık Tema";
  } else {
    darkModeBtn.innerHTML = "🌙 Karanlık Tema";
  }
}

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const dark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", dark ? "on" : "off");

  updateDarkModeButton();
});

window.addEventListener("load", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "on") {
    document.body.classList.add("dark-mode");
  }
  updateDarkModeButton();
  loadHabits();
  renderCalendar();
});

// 7 günlük takvim için
//const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const calendarContainer = document.getElementById("calendar-container");

// localstroageden verı almak ıcın
let completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];