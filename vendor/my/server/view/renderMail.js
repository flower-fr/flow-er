
const renderMail = () => {

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Material Design for Bootstrap</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    <!-- Google Fonts Roboto -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"/>
    <!-- MDB ESSENTIAL -->
    <link rel="stylesheet" href="/my/cli/resources/mdb/css/mdb.min.css" />
    <!-- MDB PLUGINS -->
    <link rel="stylesheet" href="/my/cli/resources/mdb/plugins/css/all.min.css" />
    <style>
    body {
  background-color: hsl(0, 0%, 97%);
}
@media (min-width: 1400px) {
  main,
  header,
  #main-navbar {
    padding-left: 240px;
  }
}
/* Styles for this page */
#sidenav-inner {
  border-top-left-radius: .5rem;
  border-bottom-left-radius: .5rem;
}

@media (min-width: 1000px) {
  .inner-content {
    padding-left: 240px;
  }
}

.card .sidenav-backdrop {
  z-index: 10;
}
    </style>
</head>
<body>
    <!--Main Navigation-->
<header>
  <!-- Sidenav -->
  <nav id="main-sidenav" data-mdb-sidenav-init class="sidenav sidenav-sm shadow-1" data-mdb-hidden="false"
    data-mdb-accordion="true">
    <a class="ripple d-flex justify-content-center pt-4 pb-2" href="#!" data-mdb-ripple-init
      data-mdb-ripple-color="primary">
      <img id="MDB-logo" src="https://mdbcdn.b-cdn.net/wp-content/uploads/2018/06/logo-mdb-jquery-small.webp"
        alt="MDB Logo" draggable="false" />
    </a>

    <hr class="hr">

    <ul class="sidenav-menu px-2 pb-5">
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>Overview</span></a>
      </li>

      <li class="sidenav-item pt-3">
        <span class="sidenav-subheading text-muted text-uppercase fw-bold">Create</span>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-plus fa-fw me-3"></i><span>Project</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-plus fa-fw me-3"></i><span>Database</span></a>
      </li>

      <li class="sidenav-item pt-3">
        <span class="sidenav-subheading text-muted text-uppercase fw-bold">Manage</span>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-cubes fa-fw me-3"></i><span>Projects</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-database fa-fw me-3"></i><span>Databases</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-stream fa-fw me-3"></i><span>Custom domains</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-code-branch fa-fw me-3"></i><span>Repositories</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-users fa-fw me-3"></i><span>Team</span></a>
      </li>


      <li class="sidenav-item pt-3">
        <span class="sidenav-subheading text-muted text-uppercase fw-bold">Maintain</span>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-chart-pie fa-fw me-3"></i><span>Analytics</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-sync fa-fw me-3"></i><span>Backups</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-shield-alt fa-fw me-3"></i><span>Security</span></a>
      </li>


      <li class="sidenav-item pt-3">
        <span class="sidenav-subheading text-muted text-uppercase fw-bold">Admin</span>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-money-bill fa-fw me-3"></i><span>Billing</span></a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-file-contract fa-fw me-3"></i><span>License</span></a>
      </li>

      <li class="sidenav-item pt-3">
        <span class="sidenav-subheading text-muted text-uppercase fw-bold">Tools</span>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"><i class="fas fa-hand-pointer fa-fw me-3"></i>Drag & drop builder</a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"><i class="fas fa-code fa-fw me-3"></i>Online code editor</a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"><i class="fas fa-copy fa-fw me-3"></i>SFTP</a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"><i class="fab fa-jenkins fa-fw me-3"></i>Jenkins</a>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fab fa-gitlab fa-fw me-3"></i><span>GitLab</span></a>
      </li>
    </ul>
  </nav>
  <!-- Sidenav -->

  <!-- Navbar -->
  <nav id="main-navbar" class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-1">
    <!-- Container wrapper -->
    <div class="container-fluid">
      <!-- Toggler -->
      <button data-mdb-toggle="sidenav" data-mdb-target="#main-sidenav"
        class="btn shadow-0 p-0 me-3 d-block d-xxl-none" data-mdb-ripple-init aria-controls="#main-sidenav"
        aria-haspopup="true">
        <i class="fas fa-bars fa-lg"></i>
      </button>

      <!-- Search form -->
      <form class="d-none d-md-flex input-group w-auto my-auto">
        <input id="search-focus" autocomplete="off" type="search" class="form-control rounded"
          placeholder='Search (ctrl + alt to focus)' style="min-width: 225px" />
        <span class="input-group-text border-0"><i class="fas fa-search text-secondary"></i></span>
      </form>

      <!-- Right links -->
      <ul class="navbar-nav ms-auto d-flex flex-row">
        <!-- Notification dropdown -->
        <li class="nav-item dropdown">
          <a class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownMenuLink"
            role="button" data-mdb-dropdown-init aria-expanded="false">
            <i class="fas fa-bell link-secondary"></i>
            <span class="badge rounded-pill badge-notification bg-danger">1</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" href="#">Some news</a></li>
            <li><a class="dropdown-item" href="#">Another news</a></li>
            <li>
              <a class="dropdown-item" href="#">Something else here</a>
            </li>
          </ul>
        </li>

        <!-- Icon dropdown -->
        <li class="nav-item dropdown">
          <a class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" id="navbarDropdown" role="button"
            data-mdb-dropdown-init aria-expanded="false">
            <i class="flag flag-united-kingdom m-0"></i>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-kingdom flag"></i>English
                <i class="fa fa-check text-success ms-2"></i></a>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-poland"></i>Polski</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-china"></i>中文</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-japan"></i>日本語</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-germany"></i>Deutsch</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-france"></i>Français</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-spain"></i>Español</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-russia"></i>Русский</a>
            </li>
            <li>
              <a class="dropdown-item" href="#"><i class="flag flag-portugal"></i>Português</a>
            </li>
          </ul>
        </li>

        <!-- Avatar -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle hidden-arrow d-flex align-items-center" href="#"
            id="navbarDropdownMenuLink" role="button" data-mdb-dropdown-init aria-expanded="false">
            <img src="https://mdbootstrap.com/img/new/avatars/2.jpg" class="rounded-circle" height="22" alt="Avatar"
              loading="lazy" />
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item " href="#">My profile</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- Container wrapper -->
  </nav>
  <!-- Navbar -->

  <!-- Heading -->
  <section class="text-center text-md-start">
    <!-- Background gradient -->
    <div class="p-5" style="height: 165px; 
                            background: linear-gradient(
                            to right,
                            hsl(209, 42.2%, 65%),
                            hsl(209, 42.2%, 85%)
                            );">
    </div>
    <!-- Background image -->
  </section>
  <!-- Heading -->

</header>
<!--Main Navigation-->

<!--Main layout-->
<main class="mb-5" style="margin-top: -60px;">
  <!-- Container for demo purpose -->
  <div class="container px-4">

    <!--Section: Inbox-->
    <section>
      <div class="card shadow-0">
        <div class="card-body" style="position: relative; overflow: hidden">
          <!--Section: UI-->
          <section>
            <!-- Sidenav-->
            <div id="sidenav-inner" data-mdb-sidenav-init class="sidenav shadow-2" data-mdb-hidden="false" data-mdb-accordion="true"
                 role="navigation" data-mdb-mode="side" data-mdb-position="absolute" style="z-index: 1000">
              <div class="p-3">
                <button type="button" class="btn btn-primary btn-block" data-mdb-ripple-init>
                  <i class="fas fa-plus me-2"></i>Compose
                </button>
              </div>

              <ul class="sidenav-menu">
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-inbox me-2 fa-fw"></i><span>Inbox</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-clock me-2 fa-fw"></i><span>Snoozed</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link"><i class="fas fa-paper-plane me-2 fa-fw"></i><span>Sent</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-file me-2 fa-fw"></i><span>Drafts</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-envelope me-2 fa-fw"></i><span>All mail</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-trash me-2 fa-fw"></i><span>Trash</span></a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link">
                    <i class="fas fa-exclamation-circle me-2 fa-fw"></i><span>Spam</span></a>
                </li>
              </ul>

              <hr class="hr" />

              <p class="text-center mb-1"><strong>Contacts</strong></p>

              <ul class="sidenav-menu">
                <li class="sidenav-item">
                  <a class="sidenav-link" href="">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(24).jpg" class="rounded-circle me-2"
                         style="width: 30px; height: 30px" alt="" />
                    <span class="d-block">Anna Doe</span>
                  </a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(9).jpg" class="rounded-circle me-2"
                         style="width: 30px; height: 30px" alt="" />
                    <span class="d-block">Alan Turing</span>
                  </a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(4).jpg" class="rounded-circle me-2"
                         style="width: 30px; height: 30px" alt="" />
                    <span class="d-block">Veronica Smith</span>
                  </a>
                </li>
                <li class="sidenav-item">
                  <a class="sidenav-link" href="">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(32).jpg" class="rounded-circle me-2"
                         style="width: 30px; height: 30px" alt="" />
                    <span class="d-block">Tom Johnson</span>
                  </a>
                </li>
              </ul>
            </div>
            <!-- Sidenav-->
          </section>
          <!--Section: UI-->

          <!--Section: Messages-->
          <section class="inner-content">
            <button data-mdb-toggle="sidenav" data-target="#sidenav-inner"
                    class="btn shadow-0 p-0 m-2 d-block d-lg-none" aria-controls="#sidenav-inner" aria-haspopup="true" data-mdb-ripple-init>
              <i class="fas fa-bars fa-lg"></i>
            </button>
            <div id="datatable"></div>
          </section>
          <!--Section: Messages-->
        </div>
      </div>
    </section>
    <!--Section: Inbox-->

  </div>
  <!-- Container for demo purpose -->
</main>
<!--Main layout-->

<!--Footer-->
<footer></footer>
<!--Footer-->
    <!-- MDB ESSENTIAL -->
    <script type="text/javascript" src="/my/cli/resources/mdb/js/mdb.umd.min.js"></script>
    <!-- MDB PLUGINS -->
    <script type="text/javascript" src="/my/cli/resources/mdb/plugins/js/all.min.js"></script>
    <script>
      const sidenavOuter = document.getElementById("main-sidenav");
const sidenavInstanceOuter = mdb.Sidenav.getInstance(sidenavOuter);

const sidenavInner = document.getElementById("sidenav-inner");
const sidenavInstanceInner = mdb.Sidenav.getInstance(sidenavInner);

let innerWidth = null;

const setMode = (e) => {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth) {
    return;
  }

  innerWidth = window.innerWidth;

  if (window.innerWidth < 1400) {
    sidenavInstanceOuter.changeMode("over");
    sidenavInstanceOuter.hide();
  } else {
    sidenavInstanceOuter.changeMode("side");
    sidenavInstanceOuter.show();
  }

  if (window.innerWidth < 1000) {
    sidenavInstanceInner.changeMode("over");
    sidenavInstanceInner.hide();
  } else {
    sidenavInstanceInner.changeMode("side");
    sidenavInstanceInner.show();
  }
};

setMode();

// Event listeners
window.addEventListener("resize", setMode);

const searchFocus = document.getElementById('search-focus');
const keys = [
  { keyCode: 'AltLeft', isTriggered: false },
  { keyCode: 'ControlLeft', isTriggered: false },
];

window.addEventListener('keydown', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = true;
    }
  });

  const shortcutTriggered = keys.filter((obj) => obj.isTriggered).length === keys.length;

  if (shortcutTriggered) {
    searchFocus.focus();
  }
});

window.addEventListener('keyup', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = false;
    }
  });
});

const basicData = {
  columns: ["Sender", "Title", "Message", "Date"],
  rows: [
    [
      "Vernon",
      "libero. Proin mi. Aliquam",
      "et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu.",
      "10.29.20",
    ],
    [
      "Ashton",
      "Donec porttitor tellus non",
      "augue, eu tempor erat neque non quam. Pellentesque habitant morbi",
      "11.19.20",
    ],
    [
      "Amal",
      "Nunc mauris elit, dictum",
      "elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu",
      "03.14.21",
    ],
    [
      "Rogan",
      "magna. Duis dignissim tempor",
      "penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin",
      "12.13.20",
    ],
    [
      "Vladimir",
      "Donec nibh. Quisque nonummy",
      "neque. In ornare sagittis felis. Donec tempor, est ac mattis",
      "03.25.21",
    ],
    [
      "Ulric",
      "est. Nunc ullamcorper, velit",
      "dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis",
      "12.06.20",
    ],
    [
      "Hammett",
      "netus et malesuada fames",
      "eget metus eu erat semper rutrum. Fusce dolor quam, elementum",
      "07.17.21",
    ],
    [
      "Gage",
      "lectus pede et risus.",
      "at fringilla purus mauris a nunc. In at pede. Cras",
      "11.24.20",
    ],
    [
      "Damon",
      "nec tempus scelerisque, lorem",
      "Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non,",
      "02.17.21",
    ],
    [
      "Travis",
      "nisl elementum purus, accumsan",
      "euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget",
      "09.12.20",
    ],
    [
      "Drake",
      "in consectetuer ipsum nunc",
      "neque. In ornare sagittis felis. Donec tempor, est ac mattis",
      "12.08.20",
    ],
    [
      "Finn",
      "morbi tristique senectus et",
      "dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui.",
      "06.27.21",
    ],
    [
      "Hedley",
      "nisl arcu iaculis enim,",
      "Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui,",
      "02.10.21",
    ],
    [
      "Ross",
      "odio a purus. Duis",
      "diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est",
      "03.14.21",
    ],
    [
      "William",
      "ut mi. Duis risus",
      "mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam",
      "04.16.21",
    ],
    [
      "Brennan",
      "per conubia nostra, per",
      "Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit.",
      "06.07.21",
    ],
    [
      "Deacon",
      "Nunc ullamcorper, velit in",
      "Ut semper pretium neque. Morbi quis urna. Nunc quis arcu",
      "05.10.21",
    ],
    [
      "Jameson",
      "parturient montes, nascetur ridiculus",
      "Quisque libero lacus, varius et, euismod et, commodo at, libero.",
      "10.24.20",
    ],
    [
      "Gareth",
      "lobortis risus. In mi",
      "Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean",
      "08.15.21",
    ],
    [
      "David",
      "gravida sit amet, dapibus",
      "non nisi. Aenean eget metus. In nec orci. Donec nibh.",
      "04.19.21",
    ],
    [
      "Byron",
      "metus. Aenean sed pede",
      "ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor",
      "11.18.20",
    ],
    [
      "Ciaran",
      "consectetuer euismod est arcu",
      "pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus",
      "07.22.21",
    ],
    [
      "Gary",
      "sem. Nulla interdum. Curabitur",
      "consequat enim diam vel arcu. Curabitur ut odio vel est",
      "07.15.21",
    ],
    [
      "Clark",
      "Suspendisse sed dolor. Fusce",
      "lorem ipsum sodales purus, in molestie tortor nibh sit amet",
      "06.09.21",
    ],
    [
      "Lee",
      "sed leo. Cras vehicula",
      "Phasellus at augue id ante dictum cursus. Nunc mauris elit,",
      "06.24.21",
    ],
    [
      "Isaiah",
      "at fringilla purus mauris",
      "dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec",
      "05.28.21",
    ],
    [
      "Todd",
      "eu nibh vulputate mauris",
      "ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede",
      "08.17.21",
    ],
    [
      "Nicholas",
      "mollis lectus pede et",
      "dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada",
      "03.02.21",
    ],
    [
      "Wyatt",
      "sodales elit erat vitae",
      "tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel,",
      "05.20.21",
    ],
    [
      "Callum",
      "ut, molestie in, tempus",
      "eros turpis non enim. Mauris quis turpis vitae purus gravida",
      "03.24.21",
    ],
    [
      "Neville",
      "Aliquam erat volutpat. Nulla",
      "nec enim. Nunc ut erat. Sed nunc est, mollis non,",
      "12.31.20",
    ],
    [
      "Silas",
      "congue. In scelerisque scelerisque",
      "tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat.",
      "10.20.20",
    ],
    [
      "Brenden",
      "velit justo nec ante.",
      "ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor",
      "11.25.20",
    ],
    [
      "Perry",
      "Donec tempus, lorem fringilla",
      "cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis",
      "09.23.20",
    ],
    [
      "Gil",
      "ac tellus. Suspendisse sed",
      "sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem",
      "08.19.21",
    ],
    [
      "Lester",
      "aliquet lobortis, nisi nibh",
      "Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros.",
      "12.05.20",
    ],
    [
      "Judah",
      "aliquet. Phasellus fermentum convallis",
      "interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac",
      "10.20.20",
    ],
    [
      "Xavier",
      "ultrices. Duis volutpat nunc",
      "ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit",
      "09.04.21",
    ],
    [
      "Carson",
      "mus. Aenean eget magna.",
      "id risus quis diam luctus lobortis. Class aptent taciti sociosqu",
      "04.07.21",
    ],
    [
      "Kenyon",
      "mauris a nunc. In",
      "lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam",
      "11.01.20",
    ],
    [
      "Callum",
      "neque venenatis lacus. Etiam",
      "amet ante. Vivamus non lorem vitae odio sagittis semper. Nam",
      "08.25.21",
    ],
    [
      "Judah",
      "sed dui. Fusce aliquam,",
      "dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque",
      "12.03.20",
    ],
    [
      "Gray",
      "ligula. Nullam enim. Sed",
      "sit amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet",
      "10.05.20",
    ],
    [
      "Arden",
      "auctor. Mauris vel turpis.",
      "gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit",
      "02.13.21",
    ],
    [
      "Brody",
      "justo. Praesent luctus. Curabitur",
      "pharetra, felis eget varius ultrices, mauris ipsum porta elit, a",
      "08.09.21",
    ],
    [
      "Addison",
      "interdum feugiat. Sed nec",
      "eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam",
      "09.19.20",
    ],
    [
      "Price",
      "luctus ut, pellentesque eget,",
      "Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper",
      "12.17.20",
    ],
    [
      "Merrill",
      "amet ultricies sem magna",
      "Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor",
      "04.28.21",
    ],
    [
      "Brendan",
      "odio, auctor vitae, aliquet",
      "ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci",
      "02.26.21",
    ],
    [
      "Stone",
      "lacus pede sagittis augue,",
      "mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla",
      "04.25.21",
    ],
    [
      "Damian",
      "a, facilisis non, bibendum",
      "eget metus eu erat semper rutrum. Fusce dolor quam, elementum",
      "04.16.21",
    ],
    [
      "Chandler",
      "adipiscing. Mauris molestie pharetra",
      "a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc",
      "10.22.20",
    ],
    [
      "Jonah",
      "neque non quam. Pellentesque",
      "Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris.",
      "06.23.21",
    ],
    [
      "Henry",
      "fermentum convallis ligula. Donec",
      "habitant morbi tristique senectus et netus et malesuada fames ac",
      "04.21.21",
    ],
    [
      "Zeus",
      "Sed dictum. Proin eget",
      "arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus.",
      "09.03.20",
    ],
    [
      "Eaton",
      "Sed neque. Sed eget",
      "auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus",
      "05.26.21",
    ],
    [
      "Tarik",
      "ultrices a, auctor non,",
      "tristique senectus et netus et malesuada fames ac turpis egestas.",
      "11.19.20",
    ],
    [
      "Carl",
      "sem elit, pharetra ut,",
      "scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia.",
      "01.31.21",
    ],
    [
      "Nathaniel",
      "lacus. Quisque imperdiet, erat",
      "luctus sit amet, faucibus ut, nulla. Cras eu tellus eu",
      "08.10.21",
    ],
    [
      "Walker",
      "dolor, tempus non, lacinia",
      "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur",
      "01.17.21",
    ],
    [
      "Hilel",
      "sapien. Nunc pulvinar arcu",
      "ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros",
      "09.27.20",
    ],
    [
      "Trevor",
      "Maecenas iaculis aliquet diam.",
      "nunc. Quisque ornare tortor at risus. Nunc ac sem ut",
      "06.27.21",
    ],
    [
      "Scott",
      "Aliquam fringilla cursus purus.",
      "nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem",
      "07.12.21",
    ],
    [
      "Knox",
      "Lorem ipsum dolor sit",
      "sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue",
      "09.26.20",
    ],
    [
      "Kuame",
      "eu, accumsan sed, facilisis",
      "non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget",
      "03.05.21",
    ],
    [
      "Stone",
      "In condimentum. Donec at",
      "ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus",
      "05.04.21",
    ],
    [
      "Curran",
      "eu neque pellentesque massa",
      "penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec",
      "05.27.21",
    ],
    [
      "Kennan",
      "cursus luctus, ipsum leo",
      "posuere, enim nisl elementum purus, accumsan interdum libero dui nec",
      "06.14.21",
    ],
    [
      "Kadeem",
      "iaculis enim, sit amet",
      "et, lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus.",
      "03.27.21",
    ],
    [
      "Carl",
      "Aenean gravida nunc sed",
      "eget varius ultrices, mauris ipsum porta elit, a feugiat tellus",
      "10.26.20",
    ],
    [
      "Nigel",
      "consectetuer mauris id sapien.",
      "Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus,",
      "10.20.20",
    ],
    [
      "Alfonso",
      "Cum sociis natoque penatibus",
      "dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer",
      "12.09.20",
    ],
    [
      "Raja",
      "neque vitae semper egestas,",
      "augue id ante dictum cursus. Nunc mauris elit, dictum eu,",
      "11.26.20",
    ],
    [
      "Axel",
      "penatibus et magnis dis",
      "felis eget varius ultrices, mauris ipsum porta elit, a feugiat",
      "11.02.20",
    ],
    [
      "Kirk",
      "risus. Donec egestas. Aliquam",
      "Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare",
      "10.14.20",
    ],
    [
      "Zachery",
      "consectetuer adipiscing elit. Etiam",
      "Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula.",
      "10.01.20",
    ],
    [
      "Byron",
      "dolor, nonummy ac, feugiat",
      "sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed",
      "04.06.21",
    ],
    [
      "Odysseus",
      "in sodales elit erat",
      "iaculis enim, sit amet ornare lectus justo eu arcu. Morbi",
      "12.08.20",
    ],
    [
      "Stone",
      "consectetuer adipiscing elit. Aliquam",
      "convallis, ante lectus convallis est, vitae sodales nisi magna sed",
      "04.13.21",
    ],
    [
      "Bert",
      "nec ante. Maecenas mi",
      "ultricies ornare, elit elit fermentum risus, at fringilla purus mauris",
      "11.29.20",
    ],
    [
      "Reece",
      "dictum sapien. Aenean massa.",
      "eget metus eu erat semper rutrum. Fusce dolor quam, elementum",
      "09.05.20",
    ],
    [
      "Bert",
      "feugiat non, lobortis quis,",
      "lorem eu metus. In lorem. Donec elementum, lorem ut aliquam",
      "08.23.21",
    ],
    [
      "Nolan",
      "aliquam adipiscing lacus. Ut",
      "mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent",
      "01.28.21",
    ],
    [
      "Wesley",
      "velit eget laoreet posuere,",
      "Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet",
      "09.11.20",
    ],
    [
      "Baker",
      "arcu. Vestibulum ut eros",
      "nulla. In tincidunt congue turpis. In condimentum. Donec at arcu.",
      "08.16.21",
    ],
    [
      "Gannon",
      "dictum mi, ac mattis",
      "Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus,",
      "04.25.21",
    ],
    [
      "Eric",
      "Maecenas iaculis aliquet diam.",
      "aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque",
      "03.26.21",
    ],
    [
      "Moses",
      "commodo auctor velit. Aliquam",
      "lorem ut aliquam iaculis, lacus pede sagittis augue, eu tempor",
      "04.18.21",
    ],
    [
      "Erasmus",
      "Fusce feugiat. Lorem ipsum",
      "nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus,",
      "08.26.21",
    ],
    [
      "Stephen",
      "nunc, ullamcorper eu, euismod",
      "Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi",
      "10.06.20",
    ],
    [
      "Gary",
      "In nec orci. Donec",
      "orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu,",
      "04.25.21",
    ],
    [
      "Herrod",
      "diam. Proin dolor. Nulla",
      "ultricies ornare, elit elit fermentum risus, at fringilla purus mauris",
      "08.17.21",
    ],
    [
      "Dustin",
      "neque pellentesque massa lobortis",
      "luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi",
      "03.27.21",
    ],
    [
      "Melvin",
      "semper erat, in consectetuer",
      "parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor.",
      "03.23.21",
    ],
    [
      "Rajah",
      "et, euismod et, commodo",
      "ut odio vel est tempor bibendum. Donec felis orci, adipiscing",
      "04.21.21",
    ],
    [
      "Chaney",
      "sagittis. Nullam vitae diam.",
      "nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse",
      "08.10.21",
    ],
    [
      "Walker",
      "a neque. Nullam ut",
      "a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu",
      "11.22.20",
    ],
    [
      "Silas",
      "vitae, erat. Vivamus nisi.",
      "sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo",
      "12.15.20",
    ],
    [
      "Colin",
      "ac urna. Ut tincidunt",
      "fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed",
      "03.22.21",
    ],
    [
      "Jonah",
      "lorem ac risus. Morbi",
      "Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu",
      "10.22.20",
    ],
  ],
};

const table = document.getElementById("datatable");

table.addEventListener("render.mdb.datatable", () => {
  document.querySelectorAll(".datatable tbody tr").forEach((row) => {
    const index = row.getAttribute("data-index");
    row.addEventListener("click", () => {

    });
  });
});

new mdb.Datatable(table, basicData, {
  hover: true,
  borderless: true,
  striped: true,
  selectable: true,
  fixedHeader: true,
  multi: true,
});
    </script>
</body>
</html>`
}

module.exports = {
    renderMail
}
