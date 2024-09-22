
const renderProfile = () => {

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
    <div class="p-5" style="height: 200px; 
                            background: linear-gradient(
                            to right,
                            hsl(209, 42.2%, 65%),
                            hsl(209, 42.2%, 85%)
                            );">
    </div>
    <!-- Background gradient -->
  </section>
  <!-- Heading -->

</header>
<!--Main Navigation-->

<!--Main layout-->
<main class="mb-5" style="margin-top: -100px;">
  <!-- Container for demo purpose -->
  <div class="container px-4">

    <!--Section: Profile-->
    <section>
      <div class="row gx-xl-5">
        <div class="col-md-8 mb-4 mb-md-0">
          <div class="card shadow-0 mb-5">
            <div class="card-header py-3">
              <strong>Edit profile</strong>
            </div>
            <div class="card-body text-center">
              <div class="mt-1 mb-4">
                <strong>Profile photo</strong>
              </div>

              <form action="">
                <div class="d-flex justify-content-center mb-4">
                  <div id="dnd-default-value" class="file-upload-wrapper shadow-5" style="max-width: 300px">
                    <input type="file" class="file-upload-input"
                           data-mdb-default-file="https://mdbootstrap.com/img/new/avatars/1.jpg"
                           data-mdb-file-upload-init />
                  </div>
                </div>

                <div class="form-outline mb-4" data-mdb-input-init>
                  <input type="text" id="formName" class="form-control" value="John Doe" />
                  <label class="form-label" for="formName">Name</label>
                </div>

                <div class="form-outline mb-4" data-mdb-input-init>
                  <input type="email" id="formEmail" class="form-control" value="johndoe@gmail.com" />
                  <label class="form-label" for="formEmail">Email</label>
                </div>

                <div class="form-outline mb-4" data-mdb-input-init>
                  <input type="text" id="formPosition" class="form-control" value="Founder" />
                  <label class="form-label" for="formName">Position</label>
                </div>

                <div class="form-outline mb-4" data-mdb-input-init>
                  <textarea class="form-control" id="formDescription" rows="4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ullam nihil impedit. Porro minus nemo nobis maiores numquam tempora architecto a, nisi consectetur, expedita illum, debitis aliquam incidunt molestias eveniet.
                  </textarea>
                  <label class="form-label" for="formDescription">Description</label>
                </div>

                <button type="button" class="btn btn-primary mb-2" data-mdb-ripple-init>
                  Update profile
                </button>
              </form>
            </div>
          </div>

          <div class="card shadow-0">
            <div class="card-header py-3"><strong>Change password</strong></div>
            <div class="card-body text-center pt-4">

              <form action="">
                <div class="form-outline mb-4" data-mdb-input-init>
                  <input type="password" id="newPassword" class="form-control" />
                  <label class="form-label" for="newPassword">New password</label>
                </div>

                <div class="form-outline mb-4" data-mdb-input-init>
                  <input type="password" id="confirmPassword" class="form-control" />
                  <label class="form-label" for="confirmPassword">Confirm password</label>
                </div>

                <button type="button" class="btn btn-primary mb-2" data-mdb-ripple-init>Apply</button>
              </form>

            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4 mb-md-0">
          <div class="card shadow-0">
            <div class="card-body text-center">

              <img class="rounded-circle shadow-1 mb-3" src="https://mdbootstrap.com/img/new/avatars/1.jpg"
                   alt="avatar" style="width: 150px;">

              <p class="mb-1"><strong>John Doe</strong></p>
              <p class="mb-2"><small>Founder</small></p>
              <p class="mb-2 text-muted">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia deserunt
                pariatur voluptatem consequuntur! Aliquid, placeat nobis odit delectus ad est, nemo repudiandae
                possimus repellendus voluptas debitis, numquam modi asperiores beatae?</p>

            </div>
          </div>
        </div>
      </div>
    </section>
    <!--Section: Profile-->

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
    const sidenav = document.getElementById("main-sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);

let innerWidth = null;

const setMode = (e) => {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth) {
    return;
  }

  innerWidth = window.innerWidth;

  if (window.innerWidth < 1400) {
    sidenavInstance.changeMode("over");
    sidenavInstance.hide();
  } else {
    sidenavInstance.changeMode("side");
    sidenavInstance.show();
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
    </script>
</body>
</html>`
}

module.exports = {
    renderProfile
}
